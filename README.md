阿里云分布式日志中间件
===============

## 安装环境

>+ .net core版本：2.1
>+ 开通阿里云SLS分布式日志,地址: https://sls.console.aliyun.com/lognext/profile

### 特点
~~~
1.轻量级,将日志推送到阿里云分布式日志
2.使用更加方便,支持net core DI
3.采用内部队列实现,性能更高
4.提供了可视化日志查询页面
~~~

### 应用场景
分布式日志

### 使用介绍
+ 1.获取Aliyun.Log.Core包 </br>
    方案A. install-package Aliyun.Log.Core
    方案B. nuget包管理工具搜索 Aliyun.Log.Core

+ 2.添加中间件
    ```code
        services.AddAliyunLog(m =>
        {
            m.AccessKey = sls.GetValue<string>("AccessKey");
            m.AccessKeyId = sls.GetValue<string>("AccessKeyId");
            m.Endpoint = sls.GetValue<string>("Host");
            m.Project = sls.GetValue<string>("Project");
            m.LogStoreName = sls.GetValue<string>("LogstoreName");
        });
    ```
  + 3.写入日志
  ```code
        //获取对象
        private readonly IOptions<SlsOptions> _options;
        private readonly AliyunLogClient _aliyunLogClient;
        public HomeController(IOptions<SlsOptions> options, AliyunLogClient aliyunLogClient)
        {
            _options = options;
            _aliyunLogClient = aliyunLogClient;
        }
        
        [HttpGet("/api/sendlog")]
        public async Task<JsonResult> SendLog(string topic="1")
        {
            //日志模型
            LogModel logModel = new LogModel()
            {
                ClassName = "Aliyun.log",
                Desc = "6666666666xxxxxx",
                Html = "99999999999xxxxx",
                Topic = topic,
                OrderNo = Guid.NewGuid().ToString("N"),
                PostDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
            };
            await _aliyunLogClient.Log(logModel);
            return Json("0");
        }
    ```
