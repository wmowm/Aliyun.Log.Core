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
    }
}
