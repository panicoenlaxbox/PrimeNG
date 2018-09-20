using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace WebApplication1
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public string Company { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }

    public class MyContext : DbContext
    {
        public MyContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var user = modelBuilder.Entity<User>();
            user.Property(u => u.Name).IsRequired();
            user.Property(u => u.Company).IsRequired();
            user.Property(u => u.Email).IsRequired();
            user.Property(u => u.Phone).IsRequired();
            user.Property(u => u.Address).IsRequired();
            base.OnModelCreating(modelBuilder);
        }
    }


    public class CustomExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<CustomExceptionHandlerMiddleware> _logger;
        private readonly IHostingEnvironment _hostingEnvironment;

        public CustomExceptionHandlerMiddleware(RequestDelegate next, ILogger<CustomExceptionHandlerMiddleware> logger, IHostingEnvironment hostingEnvironment)
        {
            _next = next;
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                if (_next != null)
                    await _next(context);
            }
            catch (Exception ex)
            {
                if (context.Response.HasStarted)
                {
                    _logger.LogWarning("Exception catched. Unfortunatelly the response has already started, so we just throw it");
                    throw;
                }

                var apiErrorResponse = ApiErrorResponse.CreateFromException(ex, _hostingEnvironment);

                // We don't clear headers for not breaking CORS and allow client to receive a fully detailed message

                context.Response.StatusCode = apiErrorResponse.StatusCode;
                context.Response.ContentType = System.Net.Mime.MediaTypeNames.Application.Json;

                await context.Response.WriteAsync(JsonConvert.SerializeObject(apiErrorResponse));
            }
        }
    }

    public static class CustomExceptionHandlerMiddlewareExtensions
    {
        public static void UseCustomExceptionHandlerMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<CustomExceptionHandlerMiddleware>();
        }
    }

    public class ApiErrorException : Exception
    {
        public ApiErrorException(string message, string friendlyMessage = null, ExpandoObject extraData = null, int statusCode = (int)HttpStatusCode.InternalServerError)
            : this(message, null, friendlyMessage, extraData, statusCode)
        {
        }

        public ApiErrorException(string message, Exception inner, string friendlyMessage = null, ExpandoObject extraData = null, int statusCode = (int)HttpStatusCode.InternalServerError)
            : base(message, inner)
        {
            FriendlyMessage = friendlyMessage;
            ExtraData = extraData;
            StatusCode = statusCode;
        }

        public string FriendlyMessage { get; }
        public ExpandoObject ExtraData { get; }
        public int StatusCode { get; }
    }

    public class ApiErrorResponse
    {
        private ApiErrorResponse() { }

        public string FriendlyMessage { get; private set; }
        public object ExtraData { get; private set; }
        public int StatusCode { get; private set; }
        public string ErrorType { get; private set; }
        public DebugData Debug { get; private set; }

        private const string DefaultUserMessage = "An error has occurred. We are doing our best to fix it please try in a moment.";

        public static ApiErrorResponse CreateFromException(Exception ex, IHostingEnvironment hostingEnvironment)
        {
            if (ex is ApiErrorException c)
            {
                return new ApiErrorResponse()
                {                    
                    FriendlyMessage = c.FriendlyMessage,
                    ExtraData = c.ExtraData,
                    StatusCode = c.StatusCode,
                    ErrorType = ex.GetType().Name,
                    Debug = GetDebugData(ex, hostingEnvironment)
                };
            }

            return new ApiErrorResponse()
            {                
                FriendlyMessage = DefaultUserMessage,
                StatusCode = (int)HttpStatusCode.InternalServerError,
                ErrorType = ex.GetType().Name,
                Debug = GetDebugData(ex, hostingEnvironment)
            };
        }

        private static DebugData GetDebugData(Exception ex, IHostingEnvironment hostingEnvironment)
        {
            return hostingEnvironment.IsDevelopment()
                ? new DebugData()
                {
                    Message = ex.Message,
                    StackTrace = ex.StackTrace,
                    InnerMessage = ex.InnerException?.Message,
                    InnerStackTrace = ex.InnerException?.StackTrace
                }
                : null;
        }

        public class DebugData
        {
            public string Message { get; set; }
            public string StackTrace { get; set; }
            public string InnerMessage { get; set; }
            public string InnerStackTrace { get; set; }
        }
    }

    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
