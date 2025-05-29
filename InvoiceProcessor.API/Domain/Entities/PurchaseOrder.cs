using System;
using System.Collections.Generic;
using System.Linq;

namespace InvoiceProcessor.Domain.Entities
{
    public class PurchaseOrder
    {
        public Guid Id { get; set; }

        public string PoNumber { get; set; } = string.Empty;
        public string VendorName { get; set; } = string.Empty;
        public DateTime IssueDate { get; set; }

        public List<POLineItem> LineItems { get; set; } = new();

        public decimal TotalAmount => LineItems.Sum(item => item.Amount);
    }
}