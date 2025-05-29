using InvoiceProcessor.Domain.Entities;

public interface IFormRecognizer
{
    Task<Invoice> ExtractInvoiceDataAsync(Stream pdfStream);
}
// This interface defines a method for extracting invoice data from a PDF stream.
// The method is asynchronous and returns an Invoice object containing the extracted data.
