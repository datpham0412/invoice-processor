using System.Threading.Tasks;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Domain.Enums;
namespace InvoiceProcessor.API.Application.Services
{
    public class MatchingService
    {
        private readonly IPurchaseOrderRepository _poRepository;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IExceptionRecordRepository _exceptionRecordRepository;
        public MatchingService(
            IPurchaseOrderRepository poRepository,
            IInvoiceRepository invoiceRepository,
            IExceptionRecordRepository exceptionRecordRepository)
        {
            _poRepository = poRepository;
            _invoiceRepository = invoiceRepository;
            _exceptionRecordRepository = exceptionRecordRepository;
        }
        public async Task MatchInvoiceAsync(Invoice invoice)
        {
            if (string.IsNullOrWhiteSpace(invoice.PoNumber))
            {
                await _exceptionRecordRepository.AddAsync(new ExceptionRecord
                {
                    InvoiceId = invoice.Id,
                    Reason    = "No PO number detected on invoice",
                    Timestamp = DateTime.UtcNow
                });
                await _exceptionRecordRepository.SaveChangesAsync();

                invoice.Status = InvoiceStatus.Discrepancy;
                await _invoiceRepository.UpdateAsync(invoice);
                
                return;
            }
            var purchaseOrder = await _poRepository.GetByPoNumberAsync(invoice.PoNumber);

            if (purchaseOrder == null)
            {
                await _exceptionRecordRepository.AddAsync(new ExceptionRecord
                {
                    InvoiceId = invoice.Id,
                    Reason    = $"No matching Purchase Order found for PO {invoice.PoNumber}",
                    Timestamp = DateTime.UtcNow
                });
                await _exceptionRecordRepository.SaveChangesAsync();
                return;
            }

            var poTotal      = purchaseOrder.TotalAmount;
            var invoiceTotal = invoice.TotalAmount;

            if (poTotal == invoiceTotal)
            {
                invoice.Status = InvoiceStatus.Matched;
            }
            else
            {
                await _exceptionRecordRepository.AddAsync(new ExceptionRecord
                {
                    InvoiceId = invoice.Id,
                    Reason    = $"Total amount mismatch: PO={poTotal}, Invoice={invoiceTotal}",
                    Timestamp = DateTime.UtcNow
                });
                invoice.Status = InvoiceStatus.Discrepancy;
            }

            await _invoiceRepository.UpdateAsync(invoice);
        }
    }
}