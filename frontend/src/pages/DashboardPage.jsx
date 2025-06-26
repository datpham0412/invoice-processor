"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, CheckCircle, BarChart3 } from "lucide-react"
import { useNavigate } from "react-router-dom"


export default function MatchFlowDashboard() {
  const [poProgress, setPoProgress] = useState(65)
  const [uploadProgress, setUploadProgress] = useState(80)
  const [matchProgress, setMatchProgress] = useState(100)
  const navigate = useNavigate()

  const handleCreatePO = () => {
    navigate('/create-po')
  }

  const handleUploadInvoice = () => {
    navigate('/upload-invoice')
  }

  const handleViewInvoices = () => {
    navigate('/invoices')
  }

  const handleViewPurchaseOrders = () => {
    navigate('/purchase-orders')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      {/* Floating Elements */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse pointer-events-none"></div>
      <div
        className="fixed bottom-20 right-20 w-40 h-40 bg-indigo-200/30 rounded-full blur-xl animate-pulse pointer-events-none"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-sm">
          <div className="px-8 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">MatchFlow Dashboard</h1>
                <p className="text-blue-100 text-sm">Smart invoice processing workflow</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
              <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Main Sections */}
      <div className="max-w-7xl mx-auto">
        {/* First Row - Main Workflow Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Step 1: Create Purchase Order */}
          <Card className="bg-blue-50 border-2 border-dashed border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="p-6 space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-bold text-gray-700">Create Purchase Order</h3>
              </div>

              {/* Progress Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">PO Generation Progress</span>
                    <span className="text-blue-600 font-semibold">{poProgress}%</span>
                  </div>
                  <Progress value={poProgress} className="h-2 bg-blue-100" />
                </div>

                {/* Mock PO Fields */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="h-3 bg-blue-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-blue-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-3 bg-blue-200 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-600 font-medium">In Progress</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] group-hover:shadow-md"
                onClick={handleCreatePO}
              >
                <FileText className="w-4 h-4 mr-2" />
                Create PO
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Upload Invoice */}
          <Card className="bg-indigo-50 border-2 border-dashed border-indigo-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="p-6 space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600">2</span>
                </div>
                <h3 className="text-lg font-bold text-gray-700">Upload Invoice</h3>
              </div>

              {/* Upload Area */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                  <p className="text-indigo-600 text-sm font-medium mb-2">Drop files here</p>
                  <p className="text-indigo-400 text-xs">or click to browse</p>
                </div>

                {/* Upload Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Upload Progress</span>
                    <span className="text-indigo-600 font-semibold">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2 bg-indigo-100" />
                </div>

                {/* File List */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-600">invoice_001.pdf</span>
                    <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"></div>
                    <span className="text-gray-600">invoice_002.pdf</span>
                    <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin ml-auto"></div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] group-hover:shadow-md"
                onClick={handleUploadInvoice}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Invoice
              </Button>
            </CardContent>
          </Card>

          {/* Step 3: Auto-Match Results */}
          <Card className="bg-green-50 border-2 border-dashed border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="p-6 space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600">3</span>
                </div>
                <h3 className="text-lg font-bold text-gray-700">Auto-Match Results</h3>
              </div>

              {/* Match Results */}
              <div className="space-y-4">
                {/* Match Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Matching Progress</span>
                    <span className="text-green-600 font-semibold">{matchProgress}%</span>
                  </div>
                  <Progress value={matchProgress} className="h-2 bg-green-100" />
                </div>

                {/* Match Results List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">PO-001 ↔ INV-001</p>
                        <p className="text-xs text-gray-500">Amount: $1,250.00</p>
                      </div>
                    </div>
                    <div className="text-green-600 font-semibold text-sm">100%</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">PO-002 ↔ INV-002</p>
                        <p className="text-xs text-gray-500">Amount: $890.50</p>
                      </div>
                    </div>
                    <div className="text-green-600 font-semibold text-sm">100%</div>
                  </div>
                </div>

                {/* Success Message */}
                <div className="bg-green-100 border border-green-200 rounded-lg p-3 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <p className="text-green-700 font-semibold text-sm">✓ 100% Match Found</p>
                  <p className="text-green-600 text-xs">All invoices successfully matched</p>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] group-hover:shadow-md"
                onClick={() => setMatchProgress(100)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Start Auto-Match
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Second Row - Management Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 4: View All Invoices */}
          <Card className="bg-purple-50 border-2 border-dashed border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="p-6 space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">4</span>
                </div>
                <h3 className="text-lg font-bold text-gray-700">View All Invoices</h3>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">View and manage all uploaded invoices in one place.</p>

                {/* Mock Invoice List Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-purple-100">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-700">INV-001.pdf</span>
                    </div>
                    <span className="text-xs text-purple-600">$1,250.00</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-purple-100">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-700">INV-002.pdf</span>
                    </div>
                    <span className="text-xs text-purple-600">$890.50</span>
                  </div>
                  <div className="text-center py-2">
                    <span className="text-xs text-purple-500">+12 more invoices</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] group-hover:shadow-md" onClick={handleViewInvoices}>
                <FileText className="w-4 h-4 mr-2" />
                View Invoices
              </Button>
            </CardContent>
          </Card>

          {/* Step 5: View All Purchase Orders */}
          <Card className="bg-teal-50 border-2 border-dashed border-teal-200 hover:border-teal-300 transition-all duration-300 hover:shadow-lg group">
            <CardContent className="p-6 space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-teal-600">5</span>
                </div>
                <h3 className="text-lg font-bold text-gray-700">View All Purchase Orders</h3>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">View and manage all purchase orders in one place.</p>

                {/* Mock PO List Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-teal-100">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-teal-500" />
                      <span className="text-sm text-gray-700">PO-001</span>
                    </div>
                    <span className="text-xs text-teal-600">$1,250.00</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-teal-100">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-teal-500" />
                      <span className="text-sm text-gray-700">PO-002</span>
                    </div>
                    <span className="text-xs text-teal-600">$890.50</span>
                  </div>
                  <div className="text-center py-2">
                    <span className="text-xs text-teal-500">+22 more purchase orders</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] group-hover:shadow-md" 
                onClick={handleViewPurchaseOrders}>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Purchase Orders
              </Button>
            </CardContent>
          </Card>
        </div>

      {/* Summary Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">26</p>
              <p className="text-sm text-gray-600">Purchase Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">20</p>
              <p className="text-sm text-gray-600">Invoices Uploaded</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">18</p>
              <p className="text-sm text-gray-600">Successful Matches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

  )
}
