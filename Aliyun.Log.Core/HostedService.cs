using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Aliyun.Log.Core
{
    public class HostedService : IHostedService, IDisposable
    {
        private readonly ILogger _logger;
        private readonly IServiceProvider _provider;
        private readonly IOptions<AliyunSLSOptions> _options;
        public HostedService(ILogger<HostedService> logger, IServiceProvider provider, IOptions<AliyunSLSOptions> options)
        {
            _logger = logger;
            _provider = provider;
            _options = options;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("程序启动");
            Task.Run(async () =>
            {
                using (var serviceScope = _provider.GetService<IServiceScopeFactory>().CreateScope())
                {
                    var _options = serviceScope.ServiceProvider.GetRequiredService<IOptions<AliyunSLSOptions>>();
                    var _client = serviceScope.ServiceProvider.GetRequiredService<AliyunSLSClient>();
                    while (true)
                    {
                        try
                        {
                            if (AliyunLogBuilder.logQueue.Count>0)
                            {
                                var log = AliyunLogBuilder.logQueue.Dequeue();
                                var logInfo = new LogInfo
                                {
                                    Contents =
                                {
                                    {"Topic", log.Topic.ToString()},
                                    {"OrderNo", log.OrderNo},
                                    {"ClassName", log.ClassName},
                                    { "Desc",log.Desc},
                                    { "Html",log.Html},
                                    { "PostDate",log.PostDate},
                                },
                                    Time = DateTime.Parse(log.PostDate)
                                };
                                List<LogInfo> list = new List<LogInfo>() { logInfo };
                                var logGroupInfo = new LogGroupInfo
                                {
                                    Topic = log.Topic.ToString(),
                                    Source = "localhost",
                                    Logs = list
                                };
                                await _client.PostLogs(new PostLogsRequest(_options.Value.LogStoreName, logGroupInfo));
                            }
                            else
                            {
                                await Task.Delay(1000);
                            }

                        }
                        catch (Exception ex)
                        {

                            await Task.Delay(1000);
                        }
                    }
                }
            });
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("结束");


            return Task.CompletedTask;
        }

        public void Dispose()
        {

        }
    }
}
