export const invoiceStatusMap = {
    Pending: "Pending review",
    Matched: "Matched (PO and Invoice match)",
    Discrepancy: "Discrepancy (Amount mismatch)",
    UnmatchedNoPO: "No matching Purchase Order found",
    MatchedByInvoiceNumber: "Matched by Invoice Number",
    FallbackVendorMismatch: "Vendor mismatch (Invoice number found, but vendor does not match)",
    FallbackInvoiceNotFound: "No matching PO or Invoice Number found"
  };
  
  export const statusColorMap = {
    Pending: "text-gray-500",
    Matched: "text-green-600",
    Discrepancy: "text-yellow-600",
    UnmatchedNoPO: "text-red-600",
    MatchedByInvoiceNumber: "text-blue-600",
    FallbackVendorMismatch: "text-orange-600",
    FallbackInvoiceNotFound: "text-red-600"
  };