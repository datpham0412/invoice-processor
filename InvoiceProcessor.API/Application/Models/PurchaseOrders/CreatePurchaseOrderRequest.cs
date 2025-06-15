using System;
using System.Collections.Generic;

namespace InvoiceProcessor.API.Application.Models.PurchaseOrders{

    public class CreatePurchaseOrderRequest{
        public string PoNumber { get; set; } = string.Empty;
        public string VendorName { get; set; } = string.Empty;
        public DateTime IssueDate { get; set; }
        public List<PurchaseOrderLineItemDto> LineItems { get; set; } = new();
    }
    public class PurchaseOrderLineItemDto{
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}