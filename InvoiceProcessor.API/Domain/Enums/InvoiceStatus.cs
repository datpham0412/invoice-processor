namespace InvoiceProcessor.API.Domain.Enums
{
    public enum InvoiceStatus
    {
        Pending = 0,
        Matched = 1,
        MatchedByInvoiceNumber = 2,
        PartialMatch = 3,
        Discrepancy = 4,
        UnmatchedNoPO = 5,
        FallbackVendorMismatch = 6,
        FallbackInvoiceNotFound = 7
    }
}
