namespace InvoiceProcessor.Application.Interfaces;
public interface IServiceBusClient
{
    Task EnqueueDiscrepancyAsync(Guid invoiceId, string reason);
}

// This interface defines a contract for a service bus client that can enqueue messages related to invoice discrepancies.
// The EnqueueDiscrepancyAsync method takes an invoice ID and a reason for the discrepancy, allowing the application to send messages to a service bus for further processing or notification.