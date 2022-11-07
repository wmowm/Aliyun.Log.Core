using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace Aliyun.Oss.Core
{
    public sealed class AliyunOssBuilder
    {
        public AliyunOssBuilder(IServiceCollection services)
        {
            Services = services;
        }

        /// <summary>
        /// Gets the <see cref="IServiceCollection" /> where MVC services are configured.
        /// </summary>
        public IServiceCollection Services { get; }

        /// <summary>
        /// Adds a scoped service of the type specified in serviceType with an implementation
        /// </summary>
        private AliyunOssBuilder AddScoped(Type serviceType, Type concreteType)
        {
            Services.AddScoped(serviceType, concreteType);
            return this;
        }

        /// <summary>
        /// Adds a singleton service of the type specified in serviceType with an implementation
        /// </summary>
        private AliyunOssBuilder AddSingleton(Type serviceType, Type concreteType)
        {
            Services.AddSingleton(serviceType, concreteType);
            return this;
        }
    }
}
