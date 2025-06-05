using Microsoft.AspNetCore.Mvc;
using InvoiceProcessor.API.Application.Interfaces;

[ApiController]
[Route("api/blob-test")]
public class BlobTestController : ControllerBase
{
    private readonly IBlobStorage _blobStorage;

    public BlobTestController(IBlobStorage blobStorage)
    {
        _blobStorage = blobStorage;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload()
    {
        var fileName = "test.txt";
        var content = "This is a test file uploaded to blob.";
        var stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(content));

        var url = await _blobStorage.UploadAsync(stream, fileName);
        return Ok(new { Message = "Uploaded", BlobUrl = url });
    }

    [HttpGet("download")]
    public async Task<IActionResult> Download()
    {
        var fileName = "test.txt";
        var stream = await _blobStorage.DownloadAsync(fileName);
        using var reader = new StreamReader(stream);
        var content = await reader.ReadToEndAsync();
        return Ok(new { Message = "Downloaded", Content = content });
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> Delete()
    {
        var fileName = "test.txt";
        await _blobStorage.DeleteAsync(fileName);
        return Ok(new { Message = "Deleted" });
    }
}

