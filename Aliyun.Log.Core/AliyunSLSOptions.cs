using System;

namespace Aliyun.Log.Core
{
    public class AliyunSLSOptions
    {
        public string Endpoint { get; set; }
        public string Project { get; set; }
        public string AccessKeyId { get; set; }
        public string AccessKey { get; set; }
        public string LogStoreName { get; set; }
        public string Topic { get; set; }
    }
}
