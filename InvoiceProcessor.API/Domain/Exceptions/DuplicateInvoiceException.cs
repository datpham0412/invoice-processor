using System;

namespace InvoiceProcessor.API.Domain.Exceptions
{
    public class DuplicateInvoiceException : Exception
    {
        public DuplicateInvoiceException(string vendor, string invoiceNumber)
            : base($"Invoice '{invoiceNumber}' from vendor '{vendor}' already exists.") { }
    }
}
