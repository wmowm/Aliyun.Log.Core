using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Aliyun.Log.Core.Client.Models
{
    public class SlsQueryDto
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
        /// 日志级别
        /// </summary>
        public string Topic { get; set; }


        public uint Time { get; set; }
    }
}
