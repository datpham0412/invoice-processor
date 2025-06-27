using InvoiceProcessor.API.Application.Models.ListItem;
using InvoiceProcessor.API.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/purchaseorders")]
[Authorize]
public class PurchaseOrdersController : ControllerBase
{
    private readonly IPurchaseOrderRepository _repo;
    public PurchaseOrdersController(IPurchaseOrderRepository repo) => _repo = repo;
    private string CurrentUser => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IEnumerable<PurchaseOrderListItemDto>> List()
        => await _repo.GetAllByUserAsync(CurrentUser);

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PurchaseOrderListItemDto>> Detail(Guid id)
    {
        var po = await _repo.GetByIdAsync(id, CurrentUser);
        if (po is null) return NotFound();

        var dto = new PurchaseOrderListItemDto(
            po.Id,
            po.PoNumber,
            po.VendorName,
            po.TotalAmount,
            po.IssueDate,
            po.LineItems.Select(li => new POLineItemListDto(
                li.Id, li.Description, li.Quantity, li.UnitPrice, li.Amount))
            .ToList(),
            po.Status);

        return Ok(dto);
    }

    [HttpGet("{id:guid}/items")]
    public async Task<ActionResult<IEnumerable<POLineItemListDto>>> Items(Guid id)
    {
        var po = await _repo.GetByIdAsync(id, CurrentUser);
        if (po is null) return NotFound();

        return Ok(po.LineItems.Select(li => new POLineItemListDto(
            li.Id, li.Description, li.Quantity, li.UnitPrice, li.Amount)));
    }
}
