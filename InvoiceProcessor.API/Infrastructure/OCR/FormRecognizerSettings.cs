namespace InvoiceProcessor.API.Infrastructure.OCR
{
    public class FormRecognizerSettings
    {
        public string? Endpoint { get; set; }
        public string? ApiKey { get; set; }
        public string? ModelId { get; set; }
    }
}