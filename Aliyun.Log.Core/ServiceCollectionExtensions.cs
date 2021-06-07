using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;
using System.Collections.Generic;
using System.Text;

namespace Aliyun.Log.Core
{
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Adds and configures the consistence services for the consistency.
        /// </summary>
        /// <param name="services">The services available in the application.</param>
        /// <param name="setupAction">An action to configure the <see cref="CapOptions" />.</param>
        /// <returns>An <see cref="CapBuilder" /> for application services.</returns>
        public static AliyunLogBuilder AddAliyunLog(this IServiceCollection services, Action<AliyunSLSOptions> setupAction)
        {
            if (setupAction == null)
            {
                throw new ArgumentNullException(nameof(setupAction));
            }
            //var options = new AliyunSLSOptions();
            //setupAction(options);
            services.Configure(setupAction);
            services.AddHttpClient();
            services.AddSingleton<AliyunSLSClient>();
            services.AddSingleton<AliyunLogClient>();
            services.AddHostedService<HostedService>();

            return new AliyunLogBuilder(services);
        }
    }
}
