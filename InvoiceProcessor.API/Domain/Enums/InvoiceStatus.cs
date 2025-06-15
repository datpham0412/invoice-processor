namespace InvoiceProcessor.API.Domain.Enums
{
    public enum InvoiceStatus
    {
        Pending = 0,
        Matched = 1,
        Discrepancy = 2,
        UnmatchedNoPO = 3,
        MatchedByInvoiceNumber = 4,
        FallbackVendorMismatch = 5,
        FallbackInvoiceNotFound = 6
    }
}
