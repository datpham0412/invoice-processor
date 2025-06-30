import React, { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import {
  BarChart3,
  ArrowLeft,
  Download,
  Edit,
  Copy,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building,
  Calendar,
  DollarSign,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import api from "../api/api"
import { INVOICE_STATUS, renderBadge } from "../lib/invoiceStatusMap.jsx"

export default function PurchaseOrderDetailsPage() {
  const { poId } = useParams()
  const [po, setPo] = useState(null)
  const [loading, setLoading] = useState(true)

  // fetch PO detail
  useEffect(() => {
    if (!poId) return
    setLoading(true)
    api
      .get(`/purchaseorders/${poId}`)
      .then(res => setPo(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [poId])

  if (loading || !po) {
    return <p className="p-8 text-center">Loading…</p>
  }

  const statusInfo = INVOICE_STATUS[po.status] || INVOICE_STATUS.default
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      {/* Floating backgrounds */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse pointer-events-none" />
      <div
        className="fixed bottom-20 right-20 w-40 h-40 bg-indigo-200/30 rounded-full blur-xl animate-pulse pointer-events-none"
        style={{ animationDelay: '1s' }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/purchase-orders" className="inline-flex items-center text-teal-600 hover:text-teal-700">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Purchase Orders
            </Link>
          </div>
          <div className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-2xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-sm">
            <div className="px-8 py-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <StatusIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Purchase Order Details</h1>
                  <p className="text-teal-100 text-sm">PO Number: {po.poNumber}</p>
                </div>
              </div>
              <div className="text-right">
                {renderBadge(po.status)}
                <p className="text-white/80 text-sm mt-1">${po.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-teal-600" /> <span>Purchase Order Summary</span>
                </CardTitle>
                <CardDescription>Overview of this purchase order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Building className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">{po.vendorName}</p>
                    <p className="text-xs text-gray-600">Vendor</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">{new Date(po.issueDate).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-600">Issue Date</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-900">${po.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">Total Amount</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
                <CardDescription>Detailed breakdown of PO items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 text-gray-600 text-left">Description</th>
                        <th className="py-2 text-gray-600 text-right">Qty</th>
                        <th className="py-2 text-gray-600 text-right">Unit Price</th>
                        <th className="py-2 text-gray-600 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {po.lineItems?.map(item => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-2">{item.description}</td>
                          <td className="py-2 text-right">{item.quantity}</td>
                          <td className="py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                          <td className="py-2 text-right font-medium">${item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Matched Invoices */}
            {po.matchedInvoices?.length > 0 && (
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" /> <span>Matched Invoices</span>
                  </CardTitle>
                  <CardDescription>Invoices matched to this PO</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {po.matchedInvoices.map(inv => (
                      <div key={inv.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-green-800">{inv.invoiceNumber}</h4>
                            <p className="text-sm text-green-600">
                              Matched on {new Date(inv.matchDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-800">${inv.amount.toFixed(2)}</p>
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              {inv.confidence}% Match
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button disabled variant="outline" className="w-full justify-start opacity-50 cursor-not-allowed">
                  <Download className="w-4 h-4 mr-2" /> Download PO (Coming Soon)
                </Button>
                <Button disabled variant="outline" className="w-full justify-start opacity-50 cursor-not-allowed">
                  <Copy className="w-4 h-4 mr-2"/> Duplicate PO (Coming Soon)
                </Button>
                <Button disabled variant="outline" className="w-full justify-start opacity-50 cursor-not-allowed">
                  <Edit className="w-4 h-4 mr-2"/> Edit PO (Coming Soon)
                </Button>
                <Separator />
                <Link to="/create-po">
                  <Button variant="default" className="w-full justify-start bg-teal-600 text-white hover:bg-teal-700">
                    <FileText className="w-4 h-4 mr-2"/> Create New PO
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* PO Information */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>PO Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">PO Number:</span>
                  <p className="font-medium">{po.poNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Created:</span>
                  <p className="font-medium">{new Date(po.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <div className="mt-1">
                    {renderBadge(po.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 