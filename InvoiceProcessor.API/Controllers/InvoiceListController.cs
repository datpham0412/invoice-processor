using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Application.Models;
using InvoiceProcessor.API.Application.Models.ListItem;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/invoices")]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceRepository _repo;
    public InvoicesController(IInvoiceRepository repo) => _repo = repo;

    private string CurrentUser => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    private string ToFullUrl(string blobUrl)
    {
        // If it's already absolute and not an Azure blob, just return it
        if (Uri.IsWellFormedUriString(blobUrl, UriKind.Absolute) &&
            !blobUrl.Contains(".blob.core.windows.net", StringComparison.OrdinalIgnoreCase))
            return blobUrl;

        // Rewrite raw Azure blob to proxy route
        if (blobUrl.Contains(".blob.core.windows.net", StringComparison.OrdinalIgnoreCase))
        {
            var filename = Uri.EscapeDataString(Path.GetFileName(blobUrl));
            blobUrl = $"/api/invoices/file/{filename}";
        }

        // Make relative URL absolute
        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        return blobUrl.StartsWith('/') ? $"{baseUrl}{blobUrl}" : $"{baseUrl}/{blobUrl}";
    }

    // GET /api/invoices
    [HttpGet]
    public async Task<IEnumerable<InvoiceListItemDto>> List()
    {
        var list = await _repo.GetAllByUserAsync(CurrentUser);
        return list.Select(inv => inv with
        {
            BlobUrl = ToFullUrl(inv.BlobUrl)
        });
    }

    // GET /api/invoices/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<InvoiceListItemDto>> Detail(Guid id)
    {
        var inv = await _repo.GetByIdAsync(id, CurrentUser);
        if (inv is null) return NotFound();

        var fullBlobUrl = ToFullUrl(inv.BlobUrl);

        var dto = new InvoiceListItemDto(
            inv.Id,
            inv.InvoiceNumber,
            inv.VendorName,
            inv.TotalAmount,
            inv.InvoiceDate,
            inv.Status,
            inv.LineItems.Select(li => new LineItemListDto(
                li.Id, li.Description, li.Quantity, li.UnitPrice, li.Amount))
            .ToList(),
            fullBlobUrl);

        return Ok(dto);
    }

    // optional: GET /api/invoices/{id}/items
    [HttpGet("{id:guid}/items")]
    public async Task<ActionResult<IEnumerable<LineItemListDto>>> Items(Guid id)
    {
        var inv = await _repo.GetByIdAsync(id, CurrentUser);
        if (inv is null) return NotFound();

        return Ok(inv.LineItems.Select(li => new LineItemListDto(
            li.Id, li.Description, li.Quantity, li.UnitPrice, li.Amount)));
    }
}
