using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Application.Models;
using InvoiceProcessor.API.Application.Models.ListItem;
using InvoiceProcessor.API.Application.Models.Detail;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.Extensions.Hosting;

[ApiController]
[Route("api/invoices")]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceRepository _repo;
    private readonly IWebHostEnvironment _env;

    public InvoicesController(IInvoiceRepository repo,
                              IWebHostEnvironment env)
    {
        _repo = repo;
        _env  = env;
    }

    private string CurrentUser => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    private string ToFullUrl(string blobUrl)
    {
        // ─── 1. Absolute URLs ──────────────────────────────────
        if (blobUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase))
        {
            // ► a) Proxy Azure blobs
            if (blobUrl.Contains(".blob.core.windows.net"))
            {
                var filename = Path.GetFileName(blobUrl);
                var encoded  = Uri.EscapeDataString(filename);
                return $"/api/invoices/file/{encoded}";
            }

            // ► b) In PRODUCTION, upgrade plain-HTTP links
            if (!_env.IsDevelopment())
            {
                var uri = new Uri(blobUrl, UriKind.Absolute);
                bool isLocal = uri.Host.Equals("localhost", StringComparison.OrdinalIgnoreCase)
                            || System.Net.IPAddress.TryParse(uri.Host, out _);

                if (uri.Scheme == Uri.UriSchemeHttp && !isLocal)
                    return "https://" + blobUrl.Substring("http://".Length);
            }

            return blobUrl;        // leave untouched in dev
        }

        // ─── 2. Relative URLs ──────────────────────────────────
        var scheme = Request.Headers["X-Forwarded-Proto"].FirstOrDefault()
                  ?? Request.Scheme;

        if (scheme == "http"
            && !Request.Host.Host.Contains("localhost", StringComparison.OrdinalIgnoreCase)
            && !System.Net.IPAddress.TryParse(Request.Host.Host, out _))
        {
            scheme = "https"; // 🔒 fallback upgrade
        }

        var baseUrl = $"{scheme}://{Request.Host}";
        return $"{baseUrl}{(blobUrl.StartsWith('/') ? "" : "/")}{blobUrl}";
    }

    // GET /api/invoices
    [HttpGet]
    public async Task<IEnumerable<InvoiceListItemDto>> List()
    {
        var list = await _repo.GetAllByUserAsync(CurrentUser);
        return list.Select(inv =>
        {
            var full = ToFullUrl(inv.BlobUrl);
            var clientPath = full.StartsWith("/api")
                ? full.Substring(4)
                : full;

            return inv with
            {
                BlobUrl = clientPath
            };
        });
    }

    // GET /api/invoices/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<InvoiceDetailDto>> Detail(Guid id)
    {
        var inv = await _repo.GetByIdAsync(id, CurrentUser);
        if (inv is null) return NotFound();

        string? procTime = null;
        if (inv.ExtractionStartedAt.HasValue && inv.ExtractionCompletedAt.HasValue)
        {
            var span = inv.ExtractionCompletedAt.Value - inv.ExtractionStartedAt.Value;
            procTime = $"{span.TotalSeconds:F1}s";
        }

        var fullBlobUrl = ToFullUrl(inv.BlobUrl);

        var clientBlobPath = fullBlobUrl.StartsWith("/api", StringComparison.OrdinalIgnoreCase)
            ? fullBlobUrl.Substring(4)
            : fullBlobUrl;

        var dto = new InvoiceDetailDto(
            inv.Id,
            inv.InvoiceNumber,
            inv.PoNumber,
            inv.VendorName,
            inv.TotalAmount,
            inv.InvoiceDate,
            inv.Status,

            inv.IsMatched,
            inv.MatchConfidence,
            inv.MatchType,
            inv.FailureReason,
            inv.MatchedFields,
            inv.Discrepancies,
            inv.ExceptionRecordsList,

            procTime,

            clientBlobPath,
            inv.Filename,
            inv.CreatedAt,
            inv.LineItems.Select(li => new LineItemListDto(
                li.Id, li.Description, li.Quantity, li.UnitPrice, li.Amount))
                .ToList()
        );

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
