using InvoiceProcessor.API.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using InvoiceProcessor.API.Infrastructure.Storage;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Infrastructure.Blob;
using InvoiceProcessor.API.Infrastructure.OCR;
using System.Text.Json.Serialization;
using InvoiceProcessor.API.Infrastructure.Repositories;
using InvoiceProcessor.API.Application.Services;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Bind AzureBlobSettings section in appsettings.json to the strongly typed class
builder.Services.Configure<AzureBlobSettings>(
    builder.Configuration.GetSection("AzureBlob")
);
builder.Services.AddScoped<IBlobStorage, BlobStorageService>();

builder.Services.Configure<FormRecognizerSettings>(
    builder.Configuration.GetSection("FormRecognizer")
);
builder.Services.AddScoped<IFormRecognizer, FormRecognizerClient>();

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


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
