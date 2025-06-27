using System;
using System.Threading.Tasks;
using System.Collections.Generic;
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

            // Prepare result
            var result = new MatchResult
            {
                MatchedFields = new List<string>(),
                Discrepancies = new List<string>()
            };

            // If no PO number provided, fallback logic
            if (string.IsNullOrWhiteSpace(invoice.PoNumber))
            {
                // Try fallback by invoice number + vendor
                var normalizedVendor = invoice.VendorName?.Trim().ToLowerInvariant();
                var fallbackPo = await _poRepository.GetByPoAndVendorAsync(
                    invoice.InvoiceNumber,
                    normalizedVendor!,
                    invoice.UserId);

                if (fallbackPo != null)
                {
                    invoice.PoNumber = fallbackPo.PoNumber;
                    return await HandleTotalsAsync(invoice, fallbackPo, InvoiceStatus.MatchedByInvoiceNumber);
                }

                // Try match by invoice number only
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

                // record discrepancy on PONumber field
                result.Discrepancies.Add("PoNumber");

                await LogExceptionAsync(invoice.Id, reason);
                await _invoiceRepository.UpdateAsync(invoice);
                await _invoiceRepository.SaveChangesAsync();

                result.IsMatched = false;
                result.Status = invoice.Status;
                result.FailureReason = reason;
                return result;
            }

            // PO number provided: fetch PO
            var po = await _poRepository.GetByPoNumberAsync(invoice.PoNumber, invoice.UserId);
            if (po == null)
            {
                var reason = $"No Purchase Order found with PoNumber = {invoice.PoNumber}";
                result.Discrepancies.Add("PoNumber");
                invoice.Status = InvoiceStatus.UnmatchedNoPO;
                await LogExceptionAsync(invoice.Id, reason);
                await _invoiceRepository.UpdateAsync(invoice);
                await _invoiceRepository.SaveChangesAsync();

                result.IsMatched = false;
                result.Status = invoice.Status;
                result.FailureReason = reason;
                return result;
            }

            // Final detailed match on fields
            return await HandleTotalsAsync(invoice, po, InvoiceStatus.Matched);
        }

        private async Task<MatchResult> HandleTotalsAsync(
            Invoice invoice,
            PurchaseOrder po,
            InvoiceStatus successStatus,
            string? forcedReason = null)
        {
            var result = new MatchResult
            {
                MatchedFields = new List<string>(),
                Discrepancies = new List<string>()
            };

            // Field-level comparisons
            // InvoiceNumber
            if (invoice.InvoiceNumber == po.PoNumber)
                result.MatchedFields.Add("InvoiceNumber");
            else
                result.Discrepancies.Add("InvoiceNumber");

            // VendorName
            if (string.Equals(invoice.VendorName, po.VendorName, StringComparison.OrdinalIgnoreCase))
                result.MatchedFields.Add("VendorName");
            else
                result.Discrepancies.Add("VendorName");

            // TotalAmount
            if (invoice.TotalAmount == po.TotalAmount && forcedReason == null)
                result.MatchedFields.Add("TotalAmount");
            else
                result.Discrepancies.Add("TotalAmount");

            // Determine final status
            if (result.Discrepancies.Count == 0 && forcedReason == null)
            {
                invoice.Status = successStatus;
                result.IsMatched = true;
                await LogExceptionAsync(invoice.Id, $"Invoice matched with PO {po.PoNumber}");
            }
            else
            {
                var reason = forcedReason ?? $"Fields mismatched: {string.Join(", ", result.Discrepancies)}";
                invoice.Status = InvoiceStatus.Discrepancy;
                result.IsMatched = false;
                result.FailureReason = reason;
                await LogExceptionAsync(invoice.Id, reason);
            }

            // Persist changes
            await _invoiceRepository.UpdateAsync(invoice);
            await _invoiceRepository.SaveChangesAsync();
            result.Status = invoice.Status;
            return result;
        }
    }
}
