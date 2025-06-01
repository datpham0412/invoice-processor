namespace InvoiceProcessor.API.Application.Interfaces;

public interface IBlobStorage
{
    Task<string> UploadAsync(Stream fileStream, string fileName);
    Task<Stream> DownloadAsync(string fileName);
    Task DeleteAsync(string fileName);
}
// This interface defines methods for interacting with a blob storage service.
// It includes methods for uploading, downloading, and deleting files.