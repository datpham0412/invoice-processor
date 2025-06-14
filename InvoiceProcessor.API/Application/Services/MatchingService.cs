using System.Threading.Tasks;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Domain.Entities;
using InvoiceProcessor.API.Domain.Enums;
using InvoiceProcessor.API.Application.Models;
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
        public async Task<MatchResult> MatchInvoiceAsync(Invoice invoice)
        {
            if (string.IsNullOrWhiteSpace(invoice.PoNumber))
            {
                var reason = "No PO number detected on invoice";
                await _exceptionRecordRepository.AddAsync(new ExceptionRecord
                {
                    InvoiceId = invoice.Id,
                    Reason = reason,
                    Timestamp = DateTime.UtcNow
                });

                invoice.Status = InvoiceStatus.Discrepancy;
                await _invoiceRepository.UpdateAsync(invoice);

                return new MatchResult
                {
                    IsMatched = false,
                    Status = invoice.Status,
                    FailureReason = reason
                };
            }
            var purchaseOrder = await _poRepository.GetByPoNumberAsync(invoice.PoNumber);
            if (purchaseOrder == null)
            {
                var reason = $"No matching Purchase Order found for PO {invoice.PoNumber}";
                await _exceptionRecordRepository.AddAsync(new ExceptionRecord
                {
                    InvoiceId = invoice.Id,
                    Reason    = reason,
                    Timestamp = DateTime.UtcNow
                });
                invoice.Status = InvoiceStatus.Discrepancy;
                await _invoiceRepository.UpdateAsync(invoice);
                return new MatchResult
                {
                    IsMatched = false,
                    Status = invoice.Status,
                    FailureReason = reason
                };
            }
            var poTotal      = purchaseOrder.TotalAmount;
            var invoiceTotal = invoice.TotalAmount;
            if (poTotal == invoiceTotal)
            {
                invoice.Status = InvoiceStatus.Matched;

                await _exceptionRecordRepository.AddAsync(new ExceptionRecord
                {
                    InvoiceId = invoice.Id,
                    Reason = $"Invoice successfully matched with PO {invoice.PoNumber}",
                    Timestamp = DateTime.UtcNow
                });

                await _invoiceRepository.UpdateAsync(invoice);

                return new MatchResult
                {
                    IsMatched = true,
                    Status = invoice.Status
                };
            }
            else
            {
                var reason = $"Total amount mismatch: PO={poTotal}, Invoice={invoiceTotal}";
                await _exceptionRecordRepository.AddAsync(new ExceptionRecord
                {
                    InvoiceId = invoice.Id,
                    Reason    = reason,
                    Timestamp = DateTime.UtcNow
                });
                invoice.Status = InvoiceStatus.Discrepancy;
                await _invoiceRepository.UpdateAsync(invoice);
                return new MatchResult
                {
                    IsMatched = false,
                    Status = invoice.Status,
                    FailureReason = reason
                };
            }

            await _invoiceRepository.UpdateAsync(invoice);
            return new MatchResult
            {
                IsMatched = invoice.Status == InvoiceStatus.Matched,
                Status = invoice.Status,
            };
        }
    }
}