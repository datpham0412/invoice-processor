using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Domain.Enums;
using Microsoft.Extensions.Options;

namespace InvoiceProcessor.API.Infrastructure.OCR
{
    public class FormRecognizerClient : IFormRecognizer
    {
        private readonly DocumentAnalysisClient _client;
        public FormRecognizerClient(IOptions<FormRecognizerSettings> options)
        {
            var settings = options.Value;
            if (string.IsNullOrEmpty(settings.Endpoint) || string.IsNullOrEmpty(settings.ApiKey))
            {
                throw new ArgumentException("Form Recognizer settings are not properly configured.");
            }
            var credential = new AzureKeyCredential(settings.ApiKey);
            _client = new DocumentAnalysisClient(new Uri(settings.Endpoint), credential);
        }

        public async Task<Invoice> ExtractInvoiceDataAsync(Stream pdfStream)
        {
            var operation = await _client.AnalyzeDocumentAsync(WaitUntil.Completed, "prebuilt-invoice", pdfStream);
            var doc = operation.Value.Documents.FirstOrDefault();
            if (doc == null)
            {
                throw new InvalidOperationException("No invoice data found in the document.");
            }
            var invoice = new Invoice
            {
                Id = Guid.NewGuid(),
                VendorName = doc.Fields.TryGetValue("VendorName", out var vendorField) && 
                    vendorField.Value is { } && 
                    vendorField.FieldType == DocumentFieldType.String
                        ? vendorField.Value.AsString().Replace("\n", " ").Trim()
                        : string.Empty,
                InvoiceNumber = doc.Fields.TryGetValue("InvoiceId", out var invoiceIdField) &&
                                invoiceIdField.FieldType == DocumentFieldType.String
                                ? invoiceIdField.Value.AsString()
                                : string.Empty,
                InvoiceDate = doc.Fields.TryGetValue("InvoiceDate", out var dateField) &&
                            dateField.FieldType == DocumentFieldType.Date
                                ? dateField.Value.AsDate().DateTime
                                : DateTime.UtcNow,
                Status = InvoiceStatus.Pending,
                LineItems = new List<LineItem>(),
                BlobUrl = string.Empty
            };
            if (doc.Fields.TryGetValue("Items", out var itemsField) && itemsField.FieldType == DocumentFieldType.List)
            {
                foreach (var itemField in itemsField.Value.AsList())
                {
                    if (itemField.FieldType != DocumentFieldType.Dictionary)
                        continue;
                    var itemDict = itemField.Value.AsDictionary();

                    var description = itemDict.TryGetValue("Description", out var descField) &&
                                                descField.FieldType == DocumentFieldType.String
                                                    ? descField.Value.AsString()
                                                    : string.Empty;
                    var quantity = itemDict.TryGetValue("Quantity", out var qtyField) &&
                                qtyField.FieldType == DocumentFieldType.Double
                                        ? (decimal)qtyField.Value.AsDouble()
                                        : 0;

                    decimal unitPrice = 0;
                    if (itemDict.TryGetValue("UnitPrice", out var unitPriceField))
                    {
                        unitPrice = unitPriceField.FieldType switch
                        {
                            DocumentFieldType.Double => (decimal)unitPriceField.Value.AsDouble(),
                            DocumentFieldType.Currency => (decimal)unitPriceField.Value.AsCurrency().Amount,
                            _ => 0
                        };
                    }
                    var lineItem = new LineItem
                    {
                        Id = Guid.NewGuid(),
                        InvoiceId = invoice.Id,
                        Description = description,
                        Quantity = quantity,
                        UnitPrice = unitPrice,
                        Amount = quantity * unitPrice
                    };

                    invoice.LineItems.Add(lineItem);
                }

                invoice.TotalAmount = invoice.CalculateTotal();
            }
            return invoice;
        }
    }
}