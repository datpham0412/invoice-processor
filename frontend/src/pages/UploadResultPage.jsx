"use client"

import React, { useState, useEffect } from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import api from "../api/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  ArrowLeft,
  CheckCircle,
  Download,
  Eye,
  Upload,
  BarChart3,
} from "lucide-react"
import { INVOICE_STATUS, renderBadge } from "@/lib/invoiceStatusMap.jsx"

export default function UploadResultPage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const invoiceId = params.get("id")

  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPdf, setShowPdf] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!invoiceId) {
      navigate("/dashboard")
      return
    }
    api
      .get(`/invoices/${invoiceId}`)
      .then((res) => setInvoice(res.data))
      .catch(() => navigate("/dashboard"))
      .finally(() => setLoading(false))
  }, [invoiceId, navigate])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await api.get(invoice.blobUrl, { responseType: "blob" })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement("a")
      a.href = url
      a.download = invoice.filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed:", err)
    } finally {
      setDownloading(false)
    }
  }

  if (loading || !invoice) return null

  // lookup in our shared map (fallback to "default")
  const info = INVOICE_STATUS[invoice.status] || INVOICE_STATUS.default
  const StatusIcon = info.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      {/* Floating Elements */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse pointer-events-none" />
      <div
        className="fixed bottom-20 right-20 w-40 h-40 bg-indigo-200/30 rounded-full blur-xl animate-pulse pointer-events-none"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/upload-invoice" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Upload
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/invoices" className="inline-flex items-center text-purple-600 hover:text-purple-700">
              <FileText className="w-4 h-4 mr-2" />
              View All Invoices
            </Link>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-2xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-sm">
            <div className="px-8 py-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <StatusIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Processing Complete</h1>
                  <p className="text-green-100 text-sm">
                    Invoice {invoice.invoiceNumber} has been processed
                  </p>
                </div>
              </div>
              <div className="text-right">
                {renderBadge(invoice.status)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Processing Summary */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Processing Summary</span>
                </CardTitle>
                <CardDescription>Overview of the invoice processing results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {invoice.processingTime}
                    </p>
                    <p className="text-sm text-gray-600">Processing Time</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {invoice.matchConfidence}%
                    </p>
                    <p className="text-sm text-gray-600">Match Confidence</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {invoice.lineItems.length}
                    </p>
                    <p className="text-sm text-gray-600">Line Items</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      ${invoice.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Total Amount</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Extracted Data */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Extracted Invoice Data</CardTitle>
                <CardDescription>Information automatically extracted from your invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Vendor */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Vendor</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm text-gray-500">Name:</span>
                    <p className="font-medium">{invoice.vendorName}</p>
                  </div>
                </div>

                {/* Invoice Details */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Invoice Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Invoice #:</span>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Date:</span>
                        <p className="font-medium">
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Line Items</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-600">Description</th>
                          <th className="text-right py-2 text-gray-600">Qty</th>
                          <th className="text-right py-2 text-gray-600">Unit Price</th>
                          <th className="text-right py-2 text-gray-600">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.lineItems.map((li) => (
                          <tr key={li.id} className="border-b border-gray-100">
                            <td className="py-3">{li.description}</td>
                            <td className="py-3 text-right">{li.quantity}</td>
                            <td className="py-3 text-right">${li.unitPrice.toFixed(2)}</td>
                            <td className="py-3 text-right font-medium">${li.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-300">
                          <td colSpan={3} className="py-3 text-right font-semibold">Total:</td>
                          <td className="py-3 text-right font-bold text-lg">${invoice.totalAmount.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Matching Results */}
            {invoice.matchingDetails && (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Purchase Order Matching</span>
                  </CardTitle>
                  <CardDescription>Results of automatic PO matching</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-green-800">
                        {invoice.status.startsWith("Matched") ? "Successfully Matched" : "Discrepancy Found"}
                      </h4>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {invoice.matchingDetails.matchType}
                      </Badge>
                    </div>
                    <p className="text-green-700 mb-3">
                      Invoice matched to PO: <strong>{invoice.matchingDetails.poNumber}</strong>
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {invoice.matchingDetails.matchedFields.map((f) => (
                        <div key={f} className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => setShowPdf((v) => !v)} variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  {showPdf ? "Hide" : "View"} PDF
                </Button>
                <Button onClick={handleDownload} disabled={downloading} variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  {downloading ? "Downloading…" : "Download PDF"}
                </Button>
                <Separator />
                <Link to="/upload-invoice" className="w-full">
                  <Button variant="default" className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Another
                  </Button>
                </Link>
                <Link to="/dashboard" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>File Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Filename:</span>
                  <p className="font-medium">{invoice.filename}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Uploaded:</span>
                  <p className="font-medium">{new Date(invoice.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  {renderBadge(invoice.status)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PDF Preview */}
        {showPdf && (
          <Card className="mt-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>PDF Preview</CardTitle>
                <Button onClick={() => setShowPdf(false)} variant="outline" size="sm">
                  Close Preview
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">PDF preview would be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">
                  In a real implementation, this would show the actual PDF content
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
