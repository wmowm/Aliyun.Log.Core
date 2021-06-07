using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Google.Protobuf;
using Microsoft.Extensions.Options;

namespace Aliyun.Log.Core
{
    class AliyunSLSClient:IDisposable
    {
        private readonly HttpClient _httpClient;
        private readonly IOptions<AliyunSLSOptions> _options;
        private readonly Uri endpoint;

        public AliyunSLSClient(IHttpClientFactory httpClientFactory, IOptions<AliyunSLSOptions> options)
        {
            this._httpClient = httpClientFactory.CreateClient();
            this._options = options;
            //this.endpoint = new Uri($"http://{options.Value.Project}.{options.Value.Endpoint}");
            this.endpoint = new Uri(GetHost(options.Value.Endpoint, options.Value.Project));
            _httpClient.BaseAddress = endpoint;
        }
        public async Task PostLogs(PostLogsRequest request)
        {
            var uri = new Uri(string.IsNullOrWhiteSpace(request.HashKey) ? $"/logstores/{request.LogstoreName}/shards/lb"
                        : $"/logstores/{request.LogstoreName}/shards/route?key={request.HashKey}", UriKind.RelativeOrAbsolute);
            var protoGroup = new Serialization.Protobuf.LogGroup()
            {
                Topic = request.LogGroup.Topic ?? string.Empty,
                Source = request.LogGroup.Source ?? string.Empty,
                LogTags = {
                    request.LogGroup.LogTags?.Select(p=>new Serialization.Protobuf.LogTag
                    {
                        Key=p.Key,
                        Value=p.Value
                    })??Enumerable.Empty<Serialization.Protobuf.LogTag>()
                },
                Logs ={ request.LogGroup.Logs?.Select(p=>new Serialization.Protobuf.Log()
                {
                    Time=(UInt32)p.Time.ToUnixTimeSeconds(),
                    Contents=
                    {
                        p.Contents.Select(c=>new Serialization.Protobuf.Log.Types.Content
                        {
                            Key=c.Key,
                            Value=c.Value
                        })
                    }
                })?? Enumerable.Empty<Serialization.Protobuf.Log>() }
            };
            HttpRequestMessage httpRequest = new HttpRequestMessage(HttpMethod.Post, uri);


            var binary = protoGroup.ToByteArray();
            var lz4data = LZ4.LZ4Codec.Encode(binary, 0, binary.Length);

            httpRequest.Headers.Add("x-log-bodyrawsize", binary.Length.ToString());
            httpRequest.Headers.Date = DateTimeOffset.Now;
            httpRequest.Headers.Add("x-log-apiversion", "0.6.0");
            httpRequest.Headers.Add("x-log-compresstype", "lz4");
            httpRequest.Headers.Add("x-log-signaturemethod", "hmac-sha1");
            httpRequest.Content = new System.Net.Http.ByteArrayContent(lz4data);
            httpRequest.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-protobuf");
            httpRequest.Content.Headers.Add("Content-MD5", getHexString(CalculateContentMd5(lz4data)).ToUpper());

            var signature = Convert.ToBase64String(this.ComputeSignature(httpRequest, _options.Value.AccessKey));
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("LOG", $"{_options.Value.AccessKeyId}:{signature}");
            var resp= await _httpClient.SendAsync(httpRequest);
            var str_resp= await resp.Content.ReadAsStringAsync();

        }



        private string GetHost(string endpoint,string project)
        {
            var i = endpoint.IndexOf("//");
            return endpoint.Insert(i+2, $"{project}.");
        }



        private byte[] ComputeSignature(HttpRequestMessage request, string accessKey)
        {
            string method = request.Method.Method;
            string contentMd5 = request.Content.Headers.GetValues("Content-MD5").FirstOrDefault().ToString();
            string contentType = request.Content.Headers.ContentType.MediaType;
            DateTimeOffset date = request.Headers.Date.Value;
            HttpRequestHeaders headers = request.Headers;
            string resourcePath = request.RequestUri.OriginalString;
            using (var hasher = new HMACSHA1(Encoding.UTF8.GetBytes(accessKey)))
            {
                List<string> sl = new List<string>();
                sl.Add(method);
                sl.Add(contentMd5 ?? string.Empty);
                sl.Add(contentType ?? string.Empty);
                sl.Add(date.ToString("r"));
                foreach (var item in headers.OrderBy(p => p.Key))
                {
                    if (item.Key.StartsWith("x-log") == false && item.Key.StartsWith("x-acs") == false)
                        continue;
                    if (string.IsNullOrWhiteSpace(item.Key))
                        continue;
                    sl.Add($"{item.Key}:{item.Value.FirstOrDefault()}");
                }
                sl.Add(resourcePath);
                var finalString = string.Join('\n', sl);
                return hasher.ComputeHash(Encoding.UTF8.GetBytes(finalString));
            }
        }
        private string getHexString(byte[] data)
        {
            StringBuilder sb = new StringBuilder();
            if (data != null && data.Length > 0)
            {
                foreach (var item in data)
                {

                    sb.Append(item.ToString("x2"));
                }
            }
            return sb.ToString();
        }
        private IDictionary<string, string> ParseQuery(Uri path)
        {
            var result = new Dictionary<string, string>();
            if (string.IsNullOrWhiteSpace(path.OriginalString))
            {
                var qindex = path.OriginalString.IndexOf('?');
                if (qindex >= 0)
                {
                    var queryString = path.OriginalString.Substring(qindex);
                    foreach (var item in queryString.Split('&'))
                    {
                        var kv = item.Split('=');
                        if (kv.Length == 2)
                        {
                            result.TryAdd(kv[0], kv[1]);
                        }
                    }
                }
            }
            return result;
        }
        private Byte[] CalculateContentMd5(byte[] content)
        {
            using (var hasher = MD5.Create())
            {
                return hasher.ComputeHash(content);
            }
        }

        public void Dispose()
        {
            _httpClient?.Dispose();
        }
    }
    public class PostLogsRequest
    {
        public string LogstoreName { get; set; }
        public LogGroupInfo LogGroup { get; }
        public string HashKey { get; set; }
        public PostLogsRequest(string logstoreName, LogGroupInfo logGroup)
        {
            LogstoreName = logstoreName;
            LogGroup = logGroup;
        }
    }
    public class LogGroupInfo
    {
        public string Topic { get; set; }

        public string Source { get; set; }

        public IDictionary<string, string> LogTags { get; set; }

        public IList<LogInfo> Logs { get; set; }

        public LogGroupInfo()
        {
            this.LogTags = new Dictionary<String, String>();
            this.Logs = new List<LogInfo>();
        }
    }
    public class LogInfo
    {
        public static IEnumerable<string> InvalidContentKeys { get; } = new HashSet<string>
        {
            "__time__",
            "__source__",
            "__topic__",
            "__partition_time__",
            "_extract_others_",
            "__extract_others__"
        };

        public DateTimeOffset Time { get; set; }

        public IDictionary<string, string> Contents { get; set; }

        public LogInfo()
        {
            this.Contents = new Dictionary<string, string>();
        }

        public void Validate()
        {
            var invalidKeys = this.Contents.Keys.Intersect(InvalidContentKeys).ToArray();
            if (invalidKeys.Length <= 0)
            {
                throw new ArgumentException($"{nameof(this.Contents)} contains forbidden keys: {string.Join(", ", invalidKeys)}.");
            }
        }
    }
}
