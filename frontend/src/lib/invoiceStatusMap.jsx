import {
    Clock,
    CheckCircle,
    AlertTriangle,
    XCircle,
    BarChart3,
  } from "lucide-react"
import { Badge } from "@/components/ui/badge"
  
  export const INVOICE_STATUS = {
    Pending: {
      label: "Ready to Match",
      color: "blue",
      icon: Clock,
    },
    Matched: {
      label: "Matched",
      color: "green",
      icon: CheckCircle,
    },
    MatchedByInvoiceNumber: {
      label: "Matched",
      color: "green",
      icon: CheckCircle,
    },
    PartialMatch: {
      label: "Partial Match",
      color: "yellow",
      icon: AlertTriangle,
    },
    Discrepancy: {
      label: "Discrepancy",
      color: "yellow",
      icon: AlertTriangle,
    },
    FallbackVendorMismatch: {
      label: "Discrepancy",
      color: "yellow",
      icon: AlertTriangle,
    },
    UnmatchedNoPO: {
      label: "Failed to Match",
      color: "red",
      icon: XCircle,
    },
    FallbackInvoiceNotFound: {
      label: "Failed to Match",
      color: "red",
      icon: XCircle,
    },
    default: {
      label: "Processing",
      color: "purple",
      icon: BarChart3,
    },
  }
  
// Shared utility function for rendering status badges
export const renderBadge = (status) => {
  const statusInfo = INVOICE_STATUS[status] || INVOICE_STATUS.default;
  const Icon = statusInfo.icon;
  const bg = `bg-${statusInfo.color}-100`;
  const txt = `text-${statusInfo.color}-800`;
  const bd = `border-${statusInfo.color}-200`;
  return (
    <Badge className={`${bg} ${txt} ${bd} border font-medium text-xs rounded-full px-2 py-1 flex items-center space-x-1`}>
      <Icon className={`w-3 h-3 text-${statusInfo.color}-600`} />
      <span>{statusInfo.label}</span>
    </Badge>
  );
}; 