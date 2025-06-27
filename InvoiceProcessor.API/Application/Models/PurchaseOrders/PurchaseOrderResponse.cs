using System;
using System.Collections.Generic;
using InvoiceProcessor.API.Domain.Enums;

namespace InvoiceProcessor.API.Application.Models.PurchaseOrders{
    public class PurchaseOrderResponse{
        public Guid Id { get; set; }
        public string PoNumber { get; set; } = string.Empty;
        public string VendorName { get; set; } = string.Empty;
        public DateTime IssueDate { get; set; }
        public List<PurchaseOrderLineItemResponse> LineItems { get; set; } = new();
        public decimal TotalAmount { get; set; }
        public InvoiceStatus Status { get; set; }
    }
    public class PurchaseOrderLineItemResponse{
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Amount { get; set; }
    }
}