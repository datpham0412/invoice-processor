using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using InvoiceProcessor.API.Application.Models.ListItem;
using InvoiceProcessor.API.Application.Models.Detail;
using InvoiceProcessor.API.Application.Models.PurchaseOrders;
using InvoiceProcessor.API.Application.Services;
using InvoiceProcessor.API.Application.Interfaces;

namespace InvoiceProcessor.API.Controllers
{
    [ApiController]
    [Route("api/purchaseorders")]
    [Authorize]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly CreatePurchaseOrderService _createService;
        private readonly IPurchaseOrderRepository   _poRepo;
        private readonly IInvoiceRepository         _invoiceRepo;

        public PurchaseOrdersController(
            CreatePurchaseOrderService createService,
            IPurchaseOrderRepository   poRepo,
            IInvoiceRepository         invoiceRepo)
        {
            _createService = createService;
            _poRepo        = poRepo;
            _invoiceRepo   = invoiceRepo;
        }

        private string CurrentUser =>
            User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        // POST /api/purchaseorders
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PurchaseOrderResponse>> Create([FromBody] CreatePurchaseOrderRequest req)
        {
            var userId = CurrentUser;
            try
            {
                var resp = await _createService.CreateAsync(req, userId);
                // CreatedAtAction _must_ point at our Detail action below
                return CreatedAtAction(
                    nameof(Detail),
                    new { id = resp.Id },
                    resp
                );
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET /api/purchaseorders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PurchaseOrderListItemDto>>> List()
        {
            var list = await _poRepo.GetAllByUserAsync(CurrentUser);
            return Ok(list);
        }

        // GET /api/purchaseorders/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PurchaseOrderDetailDto>> Detail(Guid id)
        {
            var po = await _poRepo.GetByIdAsync(id, CurrentUser);
            if (po is null) return NotFound();

            var matched = await _invoiceRepo.GetMatchedByPoAsync(po.PoNumber, CurrentUser);

            var dto = new PurchaseOrderDetailDto(
                po.Id,
                po.PoNumber,
                po.VendorName,
                po.TotalAmount,
                po.IssueDate,
                po.CreatedAt,
                po.Status.ToString(),
                po.LineItems
                  .Select(li => new POLineItemListDto(li.Id, li.Description, li.Quantity, li.UnitPrice, li.Amount))
                  .ToList(),
                matched
                  .Select(inv => new MatchedInvoiceDto(
                      inv.Id,
                      inv.InvoiceNumber,
                      inv.TotalAmount,
                      inv.InvoiceDate,
                      inv.Status.ToString(),
                      inv.MatchConfidence ?? 0))
                  .ToList()
            );

            return Ok(dto);
        }

        // GET /api/purchaseorders/{id}/items
        [HttpGet("{id:guid}/items")]
        public async Task<ActionResult<IEnumerable<POLineItemListDto>>> Items(Guid id)
        {
            var po = await _poRepo.GetByIdAsync(id, CurrentUser);
            if (po is null) return NotFound();

            return Ok(po.LineItems
                .Select(li => new POLineItemListDto(li.Id, li.Description, li.Quantity, li.UnitPrice, li.Amount)));
        }
    }
}
