using InvoiceProcessor.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using InvoiceProcessor.API.Infrastructure.Storage;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Infrastructure.Blob;
using InvoiceProcessor.API.Infrastructure.OCR;
using System.Text.Json.Serialization;
using InvoiceProcessor.API.Infrastructure.Repositories;
using InvoiceProcessor.API.Application.Services;
using InvoiceProcessor.API.Infrastructure.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using InvoiceProcessor.API.Infrastructure.Services;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Data.SqlClient;


var builder = WebApplication.CreateBuilder(args);

SqlConnection.ClearAllPools();


// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Invoice Processor API",
        Version = "v1"
    });

    // ✅ Add JWT support to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme 
    {
        Type = SecuritySchemeType.Http,   
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Paste only the token below; \"Bearer \" will be added automatically."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Bind AzureBlobSettings section in appsettings.json to the strongly typed class
builder.Services.Configure<AzureBlobSettings>(
    builder.Configuration.GetSection("AzureBlob")
);
builder.Services.AddScoped<IBlobStorage, BlobStorageService>();

builder.Services.Configure<FormRecognizerSettings>(
    builder.Configuration.GetSection("FormRecognizer")
);
builder.Services.AddScoped<IFormRecognizer, FormRecognizerClient>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<IExceptionRecordRepository, ExceptionRecordRepository>();
builder.Services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();   
builder.Services.AddScoped<UploadInvoiceService>();
builder.Services.AddScoped<MatchingService>();
builder.Services.AddScoped<CreatePurchaseOrderService>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>();

builder.Services.AddSingleton(jwtSettings);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Key))
        };
    });

builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// MUST be before UseRouting / MapControllers
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedProto |
                       ForwardedHeaders.XForwardedHost,
    // Trust Fly's dynamic edge IPs
    KnownNetworks = { },       // clear
    KnownProxies  = { }
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Disable HTTPS redirection in containers
if (!app.Environment.IsDevelopment())
{
    // Only use HTTPS redirection if it makes sense
    var disableHttps = Environment.GetEnvironmentVariable("DISABLE_HTTPS_REDIRECT");
    if (string.IsNullOrEmpty(disableHttps))
    {
        app.UseHttpsRedirection();
    }
}
else
{
    app.UseHttpsRedirection();
}

app.UseRouting();
app.UseAuthentication();   
app.UseAuthorization();
app.UseCors();

app.MapControllers();

app.MapGet("/", () => "Invoice API is running 🚀");

app.Run();
