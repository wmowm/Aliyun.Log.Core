using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Aliyun.Log.Core.Client.Models;
using Microsoft.Extensions.Options;
using Aliyun.Api.LogService;
using System.Web;

namespace Aliyun.Log.Core.Client.Controllers
{
    public class HomeController : Controller
    {
        private readonly IOptions<SlsOptions> _options;
        private readonly AliyunLogClient _aliyunLogClient;
        public HomeController(IOptions<SlsOptions> options, AliyunLogClient aliyunLogClient)
        {
            _options = options;
            _aliyunLogClient = aliyunLogClient;
        }

        public async Task<IActionResult> Index(string query)
        {
            query = query ?? "";
            ViewData["query"] = query;
            return View();
        }

        /// <summary>
        /// 日志查询
        /// </summary>
        /// <param name="pagesize"></param>
        /// <param name="page"></param>
        /// <param name="query"></param>
        /// <param name="OrderBy"></param>
        /// <param name="Topic"></param>
        /// <param name="QueryTimeSpan"></param>
        /// <param name="BeginDate"></param>
        /// <param name="EndDate"></param>
        /// <returns></returns>
        public async Task<ActionResult> SlsLogSearch(int pagesize, int page, string query, string OrderBy,string Topic,string level, string QueryTimeSpan, DateTime? BeginDate, DateTime? EndDate)
        {
            if (string.IsNullOrEmpty(QueryTimeSpan) || string.IsNullOrEmpty(query) || pagesize == 0 || page == 0)
            {
                return Json("");
            }
            if (QueryTimeSpan == "自定义" && (!BeginDate.HasValue || !EndDate.HasValue))
            {
                return Json("");
            }
            if (!string.IsNullOrEmpty(level)) 
            {
                query += $" & {level}";
            }
            TimeSpan ts;
            switch (QueryTimeSpan)
            {
                case "15分钟":
                    ts = new TimeSpan(0, 0, 15, 0);
                    break;
                case "1小时":
                    ts = new TimeSpan(0, 1, 0, 0);
                    break;
                case "4小时":
                    ts = new TimeSpan(0, 4, 0, 0);
                    break;
                case "1天":
                    ts = new TimeSpan(1, 0, 0, 0);
                    break;
                case "1周":
                    ts = new TimeSpan(7, 0, 0, 0);
                    break;
                default:
                    ts = new TimeSpan(0, 0, 15, 0);
                    break;
            }
            DateTime from, to;
            if (QueryTimeSpan == "自定义")
            {
                from = BeginDate.Value.ToUniversalTime();
                to = EndDate.Value.ToUniversalTime();
            }
            else
            {
                from = DateTime.UtcNow - ts;
                to = DateTime.UtcNow;
            }
            bool reverse = OrderBy == "倒排序";
            string _errMsg = string.Empty;
            //获取总条数
            long count = 0;
            var res = await Startup.client.GetHistogramsAsync(_options.Value.LogstoreName, new DateTimeOffset(from), new DateTimeOffset(to), query: query,topic:Topic);
            if (!res.IsSuccess)
            {
                return Json("获取总条数异常!");
            }
            else
            {
                count = res.Result.Count;
            }

            //获取查询对象
            List<SlsQueryDto> list = new List<SlsQueryDto>();
            var res2 = await Startup.client.GetLogsAsync
            (
                // 「必填参数」作为方法的普通必须参数
                _options.Value.LogstoreName,
                new DateTimeOffset(from),
                new DateTimeOffset(to),
                Topic,
                // 「可选参数」作为方法的可选参数，可通过命名参数方式指定
                offset: pagesize * (page - 1),
                line: pagesize,
                query: query,
                reverse: reverse
            );
            if (!res2.IsSuccess)
            {
                return Json("获取日志异常!");
            }
            else
            {
                foreach (var item in res2.Result.Logs)
                {
                    //自定义元素,可能不存在
                    var myLevel = item.ContainsKey("Level") ? item["Level"]:"";



                    var model = new SlsQueryDto()
                    {
                        ClassName = item["ClassName"],
                        Desc = HttpUtility.HtmlEncode(item["Desc"]),
                        Html = HttpUtility.HtmlEncode(item["Html"]),
                        Topic = item["__topic__"],
                        OrderNo = item["OrderNo"],
                        PostDate = item["PostDate"],
                        Time = uint.Parse(item["__time__"]),
                        Level = myLevel,
                    };
                    list.Add(model);
                }
            }
            if (reverse)
            {
                list = list.OrderByDescending(t => Convert.ToDateTime(t.PostDate)).ThenByDescending(t => t.Time).ToList();
            }
            else
            {
                list = list.OrderBy(t => Convert.ToDateTime(t.PostDate)).ThenBy(t => t.Time).ToList();
            }
            return Json(new
            {
                Total = count,
                Rows = list
            });
        }

        [HttpGet("/api/sendlog")]
        public async Task<JsonResult> SendLog(string topic="1")
        {
            //日志模型
            LogModel logModel = new LogModel()
            {
                ClassName = "Aliyun.log",
                Desc = "6666666666xxxxxx",
                Html = "99999999999xxxxx",
                Topic = topic,
                OrderNo = "test0000001",
                PostDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                Level = LogLevel.ERROR
            };

            //提交方法A
            await _aliyunLogClient.Log(logModel);

            //提交方法B
            await _aliyunLogClient.Log(logModel.OrderNo, logModel.Desc);

            return Json("0");
        }

    }
}
