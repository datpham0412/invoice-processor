using System;

namespace InvoiceProcessor.API.Domain.Exceptions
{
    public class DuplicatePoException : Exception
    {
        public DuplicatePoException(string poNumber, string userId)
            : base($"Purchase Order '{poNumber}' already exists for user '{userId}'.") { }
    }
}
