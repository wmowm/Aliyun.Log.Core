using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Aliyun.Log.Core
{
    public class AliyunLogClient
    {
        /// <summary>
        /// 写日志
        /// </summary>
        /// <param name="log"></param>
        /// <returns></returns>
        public async Task Log(LogModel log)
        {
            AliyunLogBuilder.logQueue.Enqueue(log);
        }

        /// <summary>
        /// 写日志
        /// </summary>
        /// <param name="orderNo">订单号</param>
        /// <param name="desc">描述</param>
        /// <param name="topic">日志主题</param>
        /// <param name="level">日志等级</param>
        /// <param name="className">名称空间</param>
        /// <param name="html">详细日志</param>
        /// <returns></returns>
        public async Task Log(string orderNo,string desc,string topic="", LogLevel level = LogLevel.INFO,string className = "",string html="")
        {
            var log = new LogModel()
            {
                ClassName = className,
                Desc = desc,
                Html = html,
                Level = level,
                OrderNo = orderNo,
                Topic =topic,
                PostDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
            };
            AliyunLogBuilder.logQueue.Enqueue(log);
        }
    }
}
