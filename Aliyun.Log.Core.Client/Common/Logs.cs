using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Aliyun.Api.LogService;
using Aliyun.Api.LogService.Domain.Log;

namespace Aliyun.Log.Client.Common
{
    public static class Logs
    {
        /// <summary>
        /// 阿里云日志
        /// </summary>
        public static async Task PostLogStoreLogs(string LogStoreName, ILogServiceClient client, LogModel model)
        {
            try
            {
                var logInfo = new LogInfo
                {
                    Contents =
                        {
                            {"level", model.Level.ToString()},
                            {"OrderNo", model.OrderNo},
                            {"ClassName", model.ClassName},
                            { "Desc",model.Desc},
                            { "Html",model.Html},
                            { "PostDate",model.PostDate},
                        },
                    Time = DateTime.Parse(model.PostDate)
                };
                List<LogInfo> list = new List<LogInfo>() { logInfo };
                var logGroupInfo = new LogGroupInfo
                {
                    Topic = model.Level.ToString(),
                    //LogTags =
                    //{
                    //    {"example", "true"},
                    //},
                    Source = "localhost",
                    Logs = list
                };

                var response = await client.PostLogStoreLogsAsync(LogStoreName, logGroupInfo);

                // 此接口没有返回结果，确保返回结果成功即可。
                response.EnsureSuccess();
            }
            catch (Exception ex)
            {

            }
        }
    }
    public class LogModel
    {
        /// <summary>
        /// 所在类
        /// </summary>
        public string ClassName { get; set; }


        /// <summary>
        /// 卡门网订单号
        /// </summary>
        public string OrderNo { get; set; }


        /// <summary>
        /// 提交时间
        /// </summary>
        public string PostDate { get; set; }


        /// <summary>
        /// 描述
        /// </summary>
        public string Desc { get; set; }


        /// <summary>
        /// 长字段描述
        /// </summary>
        public string Html { get; set; }

        /// <summary>
        /// 日志级别
        /// </summary>
        public int Level { get; set; }

    }
}
