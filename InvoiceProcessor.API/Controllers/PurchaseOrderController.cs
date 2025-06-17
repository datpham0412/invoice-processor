
using InvoiceProcessor.API.Application.Models.PurchaseOrders;
using InvoiceProcessor.API.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace InvoiceProcessor.API.Controllers;

[Authorize]
[ApiController]
[Route("api/purchaseorders")]
public class PurchaseOrderController : ControllerBase
{
    private readonly CreatePurchaseOrderService _createService;

    public PurchaseOrderController(CreatePurchaseOrderService createService)
    {
        _createService = createService;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PurchaseOrderResponse>> Create([FromBody] CreatePurchaseOrderRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        try
        {
            var response = await _createService.CreateAsync(request, userId);
            return CreatedAtAction(nameof(Create), new { id = response.Id }, response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    [HttpGet("{poNumber}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PurchaseOrderResponse>> GetByPoNumber(string poNumber)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var existing = await _createService.GetByPoNumberAsync(poNumber, userId);
        if (existing == null)
        {
            return NotFound();
        }

        return Ok(existing);
    }
}

