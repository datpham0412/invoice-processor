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

        public async Task<MatchResult> MatchInvoiceAsync(Invoice invoice)
        {
            if (string.IsNullOrWhiteSpace(invoice.UserId))
                throw new ArgumentException("Invoice must contain a valid UserId for matching.");

            var result = new MatchResult
            {
                MatchedFields = new List<string>(),
                Discrepancies = new List<string>()
            };

            if (string.IsNullOrWhiteSpace(invoice.PoNumber))
            {
                // fallback logic identical
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

                var maybePo = await _poRepository.GetByInvoiceNumberOnlyAsync(
                    invoice.InvoiceNumber,
                    invoice.UserId);

                string reason;
                if (maybePo != null)
                {
                    // We have a PO number match but vendor mismatch
                    invoice.Status = InvoiceStatus.FallbackVendorMismatch;
                    reason = $"Invoice number matches PO, but vendor mismatch: Expected={maybePo.VendorName}, Got={invoice.VendorName}";

                    // Record that invoice number matched
                    result.MatchedFields.Add("InvoiceNumber");
                    // Record that vendor name mismatched
                    result.Discrepancies.Add("VendorName");

                    // Optionally record total if you want:
                    if (invoice.TotalAmount == maybePo.TotalAmount)
                        result.MatchedFields.Add("TotalAmount");
                    else
                        result.Discrepancies.Add("TotalAmount");

                    // Surface which PO we attempted
                    invoice.PoNumber = maybePo.PoNumber;
                }
                else
                {
                    invoice.Status = InvoiceStatus.FallbackInvoiceNotFound;
                    reason = "No matching PO found by invoice number";
                    result.Discrepancies.Add("PoNumber");
                }

                await LogExceptionAsync(invoice.Id, reason);
                await _invoiceRepository.UpdateAsync(invoice);
                await _invoiceRepository.SaveChangesAsync();

                result.IsMatched = false;
                result.Status = invoice.Status;
                result.FailureReason = reason;
                return result;
            }

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

            // Field checks
            if (invoice.InvoiceNumber == po.PoNumber)
                result.MatchedFields.Add("InvoiceNumber");
            else
                result.Discrepancies.Add("InvoiceNumber");

            if (string.Equals(invoice.VendorName, po.VendorName, StringComparison.OrdinalIgnoreCase))
                result.MatchedFields.Add("VendorName");
            else
                result.Discrepancies.Add("VendorName");

            if (invoice.TotalAmount == po.TotalAmount && forcedReason == null)
                result.MatchedFields.Add("TotalAmount");
            else
                result.Discrepancies.Add("TotalAmount");

            // Decide status
            if (result.Discrepancies.Count == 0 && forcedReason == null)
            {
                invoice.Status = successStatus;
                result.IsMatched = true;
                await LogExceptionAsync(invoice.Id, $"Invoice matched with PO {po.PoNumber}");
            }
            else if (result.MatchedFields.Count > 0)
            {
                invoice.Status = InvoiceStatus.PartialMatch;
                result.IsMatched = false;
                result.FailureReason = forcedReason ?? $"Fields mismatched: {string.Join(", ", result.Discrepancies)}";
                await LogExceptionAsync(invoice.Id, result.FailureReason);
            }
            else
            {
                invoice.Status = InvoiceStatus.Discrepancy;
                result.IsMatched = false;
                result.FailureReason = forcedReason ?? $"Fields mismatched: {string.Join(", ", result.Discrepancies)}";
                await LogExceptionAsync(invoice.Id, result.FailureReason);
            }

            await _invoiceRepository.UpdateAsync(invoice);
            await _invoiceRepository.SaveChangesAsync();
            result.Status = invoice.Status;
            po.Status = invoice.Status;
            await _poRepository.UpdateAsync(po);
            await _poRepository.SaveChangesAsync();
            return result;
        }
    }
}
