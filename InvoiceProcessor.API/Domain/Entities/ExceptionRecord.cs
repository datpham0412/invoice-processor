using System;

namespace Domain.Entities
{
    public class ExceptionRecord
    {
        public Guid Id { get; set; }
        public Guid InvoiceId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public virtual Invoice Invoice { get; set; } = new();
    }
}
