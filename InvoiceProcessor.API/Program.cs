

using InvoiceProcessor.API.Infrastructure.Storage;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Infrastructure.Blob;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Bind AzureBlobSettings section in appsettings.json to the strongly typed class
builder.Services.Configure<AzureBlobSettings>(
    builder.Configuration.GetSection("AzureBlob")
);
builder.Services.AddScoped<IBlobStorage, BlobStorageService>();
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
