using System;
using System.Collections.Generic;
using System.Text;

namespace Aliyun.Log.Core
{
    public class LogModel
    {
        /// <summary>
        /// 所在类
        /// </summary>
        public string ClassName { get; set; }


        /// <summary>
        /// 订单号
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
        /// 日志主题
        /// </summary>
        public string Topic { get; set; } = "3";

        /// <summary>
        /// 日志级别
        /// </summary>
        public LogLevel Level { get; set; } = LogLevel.INFO;

    }

    public enum LogLevel
    {
        DEBUG=1,
        INFO=2,
        WARNING=3,
        ERROR=4,
        CRITICAL=5
    }
}
