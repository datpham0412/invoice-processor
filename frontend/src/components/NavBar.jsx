import React from "react"
import { Button } from "./ui/button"
import { BarChart3, Home, Plus, Upload, FileText, User, Settings, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function NavBar() {
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

  const handleStartAutoMatch = () => {
    navigate('/auto-match')
  }

  const handleDashboard = () => {
    navigate('/dashboard')
  }

  const handleHome = () => {
    navigate('/')
  }

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleHome}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MatchFlow</h1>
              <p className="text-xs text-gray-500">Smart Invoice Processing</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              onClick={handleDashboard}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              onClick={handleCreatePO}
            >
              <Plus className="w-4 h-4" />
              <span>Create PO</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              onClick={handleUploadInvoice}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Invoice</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              onClick={handleViewInvoices}
            >
              <FileText className="w-4 h-4" />
              <span>Invoices</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              onClick={handleViewPurchaseOrders}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Purchase Orders</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              onClick={handleStartAutoMatch}
            >
              <FileText className="w-4 h-4" />
              <span>Auto-Match</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
