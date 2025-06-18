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
        if (blobUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase))
        {
            // If it's a raw Azure Blob URL, convert it
            if (blobUrl.Contains(".blob.core.windows.net"))
            {
                var filename = Path.GetFileName(blobUrl);
                var encoded = Uri.EscapeDataString(filename);
                blobUrl = $"/api/invoices/file/{encoded}";
            }
            else
            {
                return blobUrl; // already a full URL to your backend
            }
        }

        // Convert relative path to full URL
        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        return $"{baseUrl}{(blobUrl.StartsWith('/') ? "" : "/")}{blobUrl}";
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
