using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Aliyun.Api.LogService;
using Aliyun.Log.Core.Client.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Aliyun.Log.Core.Client
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        public static ILogServiceClient client { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            var sls = Configuration.GetSection("SLS");
            services.Configure<SlsOptions>(this.Configuration.GetSection("SLS"));

            //注入阿里云(主要用来写入日志,二次封装)
            services.AddAliyunLog(m =>
            {
                m.AccessKey = sls.GetValue<string>("AccessKey");
                m.AccessKeyId = sls.GetValue<string>("AccessKeyId");
                m.Endpoint = sls.GetValue<string>("Host");
                m.Project = sls.GetValue<string>("Project");
                m.LogStoreName = sls.GetValue<string>("LogstoreName");
            });

            //使用阿里云SDK提供的方式(主要用来查询日志)
            client = LogServiceClientBuilders.HttpBuilder
           .Endpoint(sls.GetValue<string>("Host"), sls.GetValue<string>("Project"))
           .Credential(sls.GetValue<string>("AccessKeyId"), sls.GetValue<string>("AccessKey"))
           .Build();



            services.AddMvc().AddJsonOptions(options =>
            {
                //忽略循环引用
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                //不使用驼峰样式的key
                options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                //设置时间格式
                options.SerializerSettings.DateFormatString = "yyyy-MM-dd HH:mm:ss";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();
            app.UseCookiePolicy();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
