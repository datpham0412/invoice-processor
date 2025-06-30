"use client"

import React, { useState, useEffect } from "react"
import api from "@/api/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  FileText,
  BarChart3,
  Play,
  Eye,
  Search,
  Clock,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"

export default function AutoMatchPage() {
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [matchingInvoice, setMatchingInvoice] = useState(null)
  const [matchProgress, setMatchProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const navigate = useNavigate()

  // Fetch & filter
  useEffect(() => {
    api.get("/invoices")
      .then(res => {
        setInvoices(res.data)
        setFilteredInvoices(res.data.filter(inv => inv.status === "Pending"))
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    const pending = invoices.filter(inv => inv.status === "Pending")
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      setFilteredInvoices(
        pending.filter(inv =>
          inv.invoiceNumber.toLowerCase().includes(term) ||
          inv.vendorName.toLowerCase().includes(term)
        )
      )
    } else {
      setFilteredInvoices(pending)
    }
  }, [searchTerm, invoices])

  const matchInvoice = async (invoiceId) => {
    setMatchingInvoice(invoiceId)
    setMatchProgress(0)
    setCurrentStep("Initializing matching process...")

    try {
      // simulate progress
      const steps = [
        "Loading invoice data...",
        "Searching for matching purchase orders...",
        "Analyzing vendor information...",
        "Comparing amounts and line items...",
        "Validating match results...",
        "Finalizing match...",
      ]
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i])
        setMatchProgress(((i + 1) / steps.length) * 100)
        await new Promise(r => setTimeout(r, 800 + Math.random() * 400))
      }

      // actual API call
      await api.post(`/invoices/${invoiceId}/match`)
      // redirect to result
      navigate(`/upload-result?id=${invoiceId}`)
    } catch (err) {
      console.error(`Failed to match invoice ${invoiceId}:`, err)
      setCurrentStep("Matching failed. Please try again.")
      setMatchingInvoice(null)
    }
  }

  const getStatusBadge = (status) => {
    if (status === "Matched") return <Badge className="bg-green-100 text-green-800 border-green-200">Matched</Badge>
    if (status === "Discrepancy") return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Discrepancy</Badge>
    if (status === "Pending") return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Ready to Match</Badge>
    return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>
  }

  const isCurrentlyMatching = (id) => matchingInvoice === id

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <NavBar />
      
      <div className="p-4 lg:p-8">
        <div className="fixed top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse pointer-events-none" />
        <div
          className="fixed bottom-20 right-20 w-40 h-40 bg-indigo-200/30 rounded-full blur-xl animate-pulse pointer-events-none"
          style={{ animationDelay: "1s" }}
        />

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-2xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-sm">
              <div className="px-8 py-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">Auto-Match Engine</h1>
                    <p className="text-green-100 text-sm">Match invoices one at a time</p>
                  </div>
                </div>
                <div className="text-white text-right">
                  <p className="text-sm opacity-80">Ready to Match</p>
                  <p className="text-2xl font-bold">{filteredInvoices.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search invoices to match..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Matching Progress */}
              {matchingInvoice && (
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
                      <span>Matching in Progress</span>
                    </CardTitle>
                    <CardDescription>
                      Processing: {invoices.find(inv => inv.id === matchingInvoice)?.invoiceNumber}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-semibold text-green-600">{Math.round(matchProgress)}%</span>
                      </div>
                      <Progress value={matchProgress} className="h-3" />
                      <p className="text-sm text-gray-600 flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{currentStep}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Invoice List */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Invoices Ready for Matching</CardTitle>
                  <CardDescription>Click "Match" to process each invoice individually</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredInvoices.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg mb-2">No invoices ready for matching</p>
                      <p className="text-gray-400 text-sm">
                        {searchTerm ? "Try adjusting your search criteria" : "All pending invoices have been processed"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredInvoices.map(invoice => {
                        const isMatching = isCurrentlyMatching(invoice.id)
                        return (
                          <div
                            key={invoice.id}
                            className={`border rounded-lg p-4 transition-all ${
                              isMatching
                                ? "border-green-300 bg-green-50 shadow-md"
                                : "border-gray-200 hover:shadow-md hover:border-gray-300"
                            }`}
                          >
                            <div className="grid grid-cols-12 gap-4 items-center">
                              {/* Info */}
                              <div className="col-span-5">
                                <h4 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h4>
                                <p className="text-sm text-gray-600">{invoice.vendorName}</p>
                                <p className="text-xs text-gray-500">{invoice.filename}</p>
                              </div>
                              {/* Amount & Date */}
                              <div className="col-span-3 text-right">
                                <p className="font-semibold text-gray-900">${invoice.totalAmount.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(invoice.invoiceDate).toLocaleDateString()}
                                </p>
                              </div>
                              {/* Status */}
                              <div className="col-span-2 flex justify-center">
                                {isMatching ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
                                    <span className="text-sm text-green-600 font-medium">Matching...</span>
                                  </div>
                                ) : (
                                  getStatusBadge(invoice.status)
                                )}
                              </div>
                              {/* Action */}
                              <div className="col-span-2 flex justify-end">
                                <Button
                                  onClick={() => matchInvoice(invoice.id)}
                                  disabled={!!matchingInvoice}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                                >
                                  <Play className="w-4 h-4 mr-1" />
                                  {isMatching ? "Processing..." : "Match"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Statistics */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Matching Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{filteredInvoices.length}</p>
                    <p className="text-sm text-gray-600">Ready to Match</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {invoices.filter(inv => inv.status === "Matched").length}
                    </p>
                    <p className="text-sm text-gray-600">Successfully Matched</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {invoices.filter(inv => inv.status === "Discrepancy").length}
                    </p>
                    <p className="text-sm text-gray-600">Discrepancies Found</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{matchingInvoice ? 1 : 0}</p>
                    <p className="text-sm text-gray-600">Currently Processing</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/invoices" className="w-full">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="w-4 h-4 mr-2" />
                      View All Invoices
                    </Button>
                  </Link>
                  <Link to="/purchase-orders" className="w-full">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Purchase Orders
                    </Button>
                  </Link>
                  <Link to="/upload-invoice" className="w-full">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="w-4 h-4 mr-2" />
                      Upload New Invoice
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
