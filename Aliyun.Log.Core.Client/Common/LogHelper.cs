using System;
using System.Collections.Concurrent;
using System.Threading;
using Aliyun.Api.LogService;
namespace Aliyun.Log.Client.Common
{
    /// <summary>
    /// 日志服务
    /// </summary>
    public class LogHelper
    {
        public static ILogServiceClient _client;

        private static string projectName = "tibos";

        private static string slnName = "{0}:Fulu.Tibos";

        private static string logstore;

        static LogHelper()
        {
            RegisterWriteLog();
        }
        /// <summary>
        /// 阿里云注册
        /// </summary>
        public static void Builder(string envName)
        {
            string accessKeyId = "LTAI5tQH75hCmoRFsi1sRd9m";
            string accessKeySecret = "FkhDNHS2t7j2wpo8S9HbskM0W3032L";
            string endpoint = "http://cn-hangzhou.log.aliyuncs.com";
            logstore = projectName;
            slnName = string.Format(slnName, envName);

            _client = LogServiceClientBuilders.HttpBuilder
                .Endpoint(endpoint, projectName)
                .Credential(accessKeyId, accessKeySecret)
                .Build();
        }
        /// <summary>
        /// 阿里云日志服务
        /// </summary>
        public static async void Log(string className, string fnName, string orderNo, string message,
            string html = "", bool dbLog = true, int level = 3)
        {
            try
            {
                LogModel model = new LogModel()
                {
                    ClassName = slnName + "." + className + "-->" + fnName,
                    OrderNo = orderNo,
                    Level = level,
                    Html = html,
                    Desc = message,
                    PostDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff")
                };
                _que.Enqueue(model);
                _mre.Set();
            }
            catch (Exception ex)
            {
            }
        }

        private static ConcurrentQueue<LogModel> _que;
        private static ManualResetEvent _mre;
        public static void RegisterWriteLog()
        {
            if (_que != null)
            {
                return;
            }
            _mre = new ManualResetEvent(false);
            _que = new ConcurrentQueue<LogModel>();

            Thread th = new Thread(NewWriteLog);
            th.IsBackground = true;
            th.Start();
        }

        private static async void NewWriteLog()
        {
            while (true)
            {
                _mre.WaitOne();

                LogModel msg;
                while (_que.Count > 0 && _que.TryDequeue(out msg))
                {
                    try
                    {
                        await Logs.PostLogStoreLogs(logstore, _client, msg);
                    }
                    catch (Exception ex)
                    {

                    }
                }
                _mre.Reset();

                Thread.Sleep(2000);
            }
        }
    }
}
