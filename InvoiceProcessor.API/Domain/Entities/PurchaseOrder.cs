using System;
using System.Collections.Generic;
using System.Linq;
using InvoiceProcessor.API.Domain.Enums;

namespace InvoiceProcessor.API.Domain.Entities
{
    public class PurchaseOrder
    {
        public Guid Id { get; set; }
        public string PoNumber { get; set; } = string.Empty;
        public string VendorName { get; set; } = string.Empty;
        public DateTime IssueDate { get; set; }
        public List<POLineItem> LineItems { get; set; } = new();
        public decimal TotalAmount { get; set; }
        public string UserId { get; set; } = default!;
        public AppUser User { get; set; } = default!;
        public InvoiceStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}