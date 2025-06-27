using System;
using System.Threading.Tasks;
using InvoiceProcessor.API.Application.Interfaces;
using InvoiceProcessor.API.Application.Models;
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

        private async Task LogExceptionAsync(Guid invoiceId, string reason)
        {
            await _exceptionRecordRepository.AddAsync(new ExceptionRecord
            {
                InvoiceId = invoiceId,
                Reason = reason,
                Timestamp = DateTime.UtcNow
            });
            await _exceptionRecordRepository.SaveChangesAsync();
        }

        /// <summary>
        /// Attempt to match an existing invoice against purchase orders.
        /// Returns a MatchResult and persists status & exception records.
        /// </summary>
        public async Task<MatchResult> MatchInvoiceAsync(Invoice invoice)
        {
            if (string.IsNullOrWhiteSpace(invoice.UserId))
                throw new ArgumentException("Invoice must contain a valid UserId for matching.");

            if (string.IsNullOrWhiteSpace(invoice.PoNumber))
            {
                // Fallback by invoice number + vendor
                var normalizedVendor = invoice.VendorName?.Trim().ToLowerInvariant();
                var fallbackPo = await _poRepository.GetByPoAndVendorAsync(
                    invoice.InvoiceNumber,
                    normalizedVendor!,
                    invoice.UserId);

                if (fallbackPo != null)
                {
                    invoice.PoNumber = fallbackPo.PoNumber;
                    return await HandleTotalsAsync(
                        invoice,
                        fallbackPo,
                        InvoiceStatus.MatchedByInvoiceNumber);
                }

                // Check mismatch vs no PO
                var maybePo = await _poRepository.GetByInvoiceNumberOnlyAsync(
                    invoice.InvoiceNumber,
                    invoice.UserId);
                string reason;

                if (maybePo != null)
                {
                    invoice.Status = InvoiceStatus.FallbackVendorMismatch;
                    reason = $"Invoice number matches PO, but vendor mismatch: Expected={maybePo.VendorName}, Got={invoice.VendorName}";
                }
                else
                {
                    invoice.Status = InvoiceStatus.FallbackInvoiceNotFound;
                    reason = "No matching PO found by invoice number";
                }

                await LogExceptionAsync(invoice.Id, reason);
                await _invoiceRepository.UpdateAsync(invoice);
                await _invoiceRepository.SaveChangesAsync();

                return new MatchResult
                {
                    IsMatched = false,
                    Status = invoice.Status,
                    FailureReason = reason
                };
            }

            var po = await _poRepository.GetByPoNumberAsync(invoice.PoNumber, invoice.UserId);
            if (po == null)
            {
                var reason = $"No Purchase Order found with PoNumber = {invoice.PoNumber}";
                await LogExceptionAsync(invoice.Id, reason);

                invoice.Status = InvoiceStatus.UnmatchedNoPO;
                await _invoiceRepository.UpdateAsync(invoice);
                await _invoiceRepository.SaveChangesAsync();

                return new MatchResult
                {
                    IsMatched = false,
                    Status = invoice.Status,
                    FailureReason = reason
                };
            }

            // Final total check
            return await HandleTotalsAsync(invoice, po, InvoiceStatus.Matched);
        }

        private async Task<MatchResult> HandleTotalsAsync(
            Invoice invoice,
            PurchaseOrder po,
            InvoiceStatus successStatus,
            string? forcedReason = null)
        {
            var poTotal = po.TotalAmount;
            var invoiceTotal = invoice.TotalAmount;
            var isMatch = poTotal == invoiceTotal && forcedReason == null;

            if (isMatch)
            {
                invoice.Status = successStatus;
                await LogExceptionAsync(invoice.Id, $"Invoice matched with PO {po.PoNumber}");
                await _invoiceRepository.UpdateAsync(invoice);
                await _invoiceRepository.SaveChangesAsync();

                return new MatchResult
                {
                    IsMatched = true,
                    Status = invoice.Status
                };
            }

            var reason = forcedReason ?? $"Total amount mismatch: PO={poTotal}, Invoice={invoiceTotal}";
            await LogExceptionAsync(invoice.Id, reason);

            invoice.Status = InvoiceStatus.Discrepancy;
            await _invoiceRepository.UpdateAsync(invoice);
            await _invoiceRepository.SaveChangesAsync();

            return new MatchResult
            {
                IsMatched = false,
                Status = invoice.Status,
                FailureReason = reason
            };
        }
    }
}
