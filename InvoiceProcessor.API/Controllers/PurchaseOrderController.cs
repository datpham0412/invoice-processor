
using InvoiceProcessor.API.Application.Models.PurchaseOrders;
using InvoiceProcessor.API.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceProcessor.API.Controllers;

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
        try
        {
            var response = await _createService.CreateAsync(request);
            return CreatedAtAction(nameof(Create), new { id = response.Id }, response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

