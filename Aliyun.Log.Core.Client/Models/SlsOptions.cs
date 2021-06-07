using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Aliyun.Log.Core.Client.Models
{
    public class SlsOptions
    {
        public string Host { get; set; }
        public string Project { get; set; }
        public string AccessKeyId { get; set; }
        public string AccessKey { get; set; }
        public string LogstoreName { get; set; }
    }
}
