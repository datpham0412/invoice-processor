import React, { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { BarChart3, ArrowLeft, Search, Plus, Filter, Eye } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/api"
import { INVOICE_STATUS, renderBadge } from "../lib/invoiceStatusMap.jsx"

// Helper function to get status group for filtering
const getStatusGroup = (status) => {
  const info = INVOICE_STATUS[status] || INVOICE_STATUS.default;
  if (info.label === "Matched") return "Matched";
  if (info.label === "Partial Match" || info.label === "Discrepancy") return "Discrepancy";
  if (info.label === "Failed to Match") return "Failed";
  return "Pending";
};

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [filteredPOs, setFilteredPOs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const navigate = useNavigate()
  const statuses = ["All", "Pending", "Matched", "Discrepancy", "Failed"]

  useEffect(() => {
    // fetch POs
    api.get('/purchaseorders')
      .then(res => {
        setPurchaseOrders(res.data)
        setFilteredPOs(res.data)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    let filtered = purchaseOrders.filter(po => {
      const matchesSearch =
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        selectedStatus === 'All' || getStatusGroup(po.status) === selectedStatus
      return matchesSearch && matchesStatus
    })
    setFilteredPOs(filtered)
  }, [searchTerm, selectedStatus, purchaseOrders])

  const handleViewDetails = (poId) => {
    navigate(`/purchase-orders/${poId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      <div className="fixed top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse pointer-events-none" />
      <div
        className="fixed bottom-20 right-20 w-40 h-40 bg-indigo-200/30 rounded-full blur-xl animate-pulse pointer-events-none"
        style={{ animationDelay: '1s' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-2xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-sm">
            <div className="px-8 py-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Purchase Orders</h1>
                  <p className="text-teal-100 text-sm">Manage and track all your purchase orders</p>
                </div>
              </div>
              <Link to="/create-po">
                <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New PO
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by PO number or vendor name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="h-12 px-3 border border-gray-200 rounded-md focus:border-teal-500 focus:ring-teal-500"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Orders Table */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Purchase Orders ({filteredPOs.length})</CardTitle>
            <CardDescription>View and manage all your purchase orders</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPOs.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No purchase orders found</p>
                <p className="text-gray-400 text-sm">
                  {(searchTerm || selectedStatus !== 'All')
                    ? 'Try adjusting your search or filter criteria'
                    : 'Create your first purchase order to get started'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPOs.map(po => (
                  <div key={po.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{po.poNumber}</h3>
                          <p className="text-sm text-gray-600">{po.vendorName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${po.totalAmount.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">{new Date(po.issueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          {renderBadge(po.status)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(po.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{filteredPOs.length}</p>
              <p className="text-sm text-gray-600">Displayed POs</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{filteredPOs.filter(po => getStatusGroup(po.status) === 'Matched').length}</p>
              <p className="text-sm text-gray-600">Matched</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{filteredPOs.filter(po => getStatusGroup(po.status) === 'Discrepancy').length}</p>
              <p className="text-sm text-gray-600">Discrepancies</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{filteredPOs.filter(po => getStatusGroup(po.status) === 'Pending').length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">
                ${filteredPOs.reduce((sum, po) => sum + po.totalAmount, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 