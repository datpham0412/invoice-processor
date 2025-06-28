using System;
using System.Text.Json.Serialization;
namespace InvoiceProcessor.API.Domain.Entities
{
    public class ExceptionRecord
    {
        public Guid Id { get; set; }
        public Guid InvoiceId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        [JsonIgnore]
        public virtual Invoice? Invoice { get; set; }
    }
}
