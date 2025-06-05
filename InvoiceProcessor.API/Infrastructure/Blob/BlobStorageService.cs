using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Infrastructure.Storage;
using Microsoft.Extensions.Options;

namespace InvoiceProcessor.API.Infrastructure.Blob
{
    public class BlobStorageService : IBlobStorage
    {
        private readonly AzureBlobSettings _settings;
        private readonly BlobContainerClient _containerClient;

        public BlobStorageService(IOptions<AzureBlobSettings> options)
        {
            _settings = options.Value;
            _containerClient = new BlobContainerClient(_settings.ConnectionString, _settings.ContainerName);
            _containerClient.CreateIfNotExists(PublicAccessType.Blob);
        }
        public async Task<string> UploadAsync(Stream fileStream, string fileName)
        {
            var blobClient = _containerClient.GetBlobClient(fileName);
            await blobClient.UploadAsync(fileStream, overwrite: true);
            return blobClient.Uri.ToString();
        }
        public async Task<Stream> DownloadAsync(string fileName)
        {
            var blobClient = _containerClient.GetBlobClient(fileName);
            var response = await blobClient.DownloadAsync();
            return response.Value.Content;
        }
        public async Task DeleteAsync(string fileName)
        {
            var blobClient = _containerClient.GetBlobClient(fileName);
            await blobClient.DeleteIfExistsAsync();
        }
    }
}