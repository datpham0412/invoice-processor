using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Domain.Enums;

namespace InvoiceProcessor.API.Application.Models{
    public class MatchResult{
        public bool IsMatched { get; set; }
        public InvoiceStatus Status { get; set; }
        public string? FailureReason { get; set; }
    }
}