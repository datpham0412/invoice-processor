"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  ArrowLeft,
  Search,
  Download,
  Eye,
  ChevronDown,
  ChevronRight,
  Filter,
} from "lucide-react";
import { INVOICE_STATUS, renderBadge } from "@/lib/invoiceStatusMap.jsx";
import NavBar from "../components/NavBar";

// Helper function to get status group for filtering
const getStatusGroup = (status) => {
  const info = INVOICE_STATUS[status] || INVOICE_STATUS.default;
  if (info.label === "Matched") return "Matched";
  if (info.label === "Partial Match" || info.label === "Discrepancy") return "Discrepancy";
  if (info.label === "Failed to Match") return "Failed";
  return "Pending";
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState("All Status");
  const [expanded, setExpanded] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const buckets = ["All Status", "Pending", "Matched", "Discrepancy", "Failed"];

  useEffect(() => {
    setLoading(true);
    api.get("/invoices")
      .then(res => {
        setInvoices(res.data);
        setFiltered(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let arr = invoices.filter(inv =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selected !== "All Status") {
      arr = arr.filter(inv => getStatusGroup(inv.status) === selected);
    }
    setFiltered(arr);
  }, [searchTerm, selected, invoices]);

  const toggleRow = id => {
    const s = new Set(expanded);
    s.has(id) ? s.delete(id) : s.add(id);
    setExpanded(s);
  };

  const download = async inv => {
    setLoading(true);
    try {
      const res = await api.get(inv.blobUrl, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${inv.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      console.error("Download failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <NavBar />
      
      <div className="p-4 lg:p-8">
        <div className="fixed top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse pointer-events-none" />
        <div
          className="fixed bottom-20 right-20 w-40 h-40 bg-indigo-200/30 rounded-full blur-xl animate-pulse pointer-events-none"
          style={{ animationDelay: "1s" }}
        />

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-sm">
              <div className="px-8 py-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">All Invoices</h1>
                  <p className="text-purple-100 text-sm">View and manage all your uploaded invoices</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <Card className="mb-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by invoice number or vendor name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selected}
                    onChange={e => setSelected(e.target.value)}
                    className="h-12 px-3 border border-gray-200 rounded-md focus:border-purple-500 focus:ring-purple-500"
                  >
                    {buckets.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Invoices ({filtered.length})
              </CardTitle>
              <CardDescription className="text-gray-600">
                Click on any invoice to expand or view details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No invoices found</p>
                  <p className="text-gray-400 text-sm">
                    {searchTerm || selected !== "All Status"
                      ? "Try adjusting search or filter"
                      : "Upload your first invoice"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((inv) => (
                    <div key={inv.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Main Row */}
                      <div className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* 1) Expand/Collapse */}
                          <div className="col-span-1 flex justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1"
                              onClick={() => toggleRow(inv.id)}
                            >
                              {expanded.has(inv.id) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </Button>
                          </div>

                          {/* 2) Invoice # + Vendor */}
                          <div className="col-span-3">
                            <h3 className="font-semibold text-gray-900">{inv.invoiceNumber}</h3>
                            <p className="text-sm text-gray-600">{inv.vendorName}</p>
                          </div>

                          {/* 3) Amount + Date */}
                          <div className="col-span-2 text-right">
                            <p className="font-semibold text-gray-900">
                              ${inv.totalAmount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(inv.invoiceDate).toLocaleDateString()}
                            </p>
                          </div>

                          {/* 4) Status Badge */}
                          <div className="col-span-2 flex justify-center">
                            {renderBadge(inv.status)}
                          </div>

                          {/* 5) Actions */}
                          <div className="col-span-4 flex items-center justify-end space-x-2">
                          <Link to={`/upload-result?id=${inv.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                Details
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => download(inv)}
                              disabled={loading}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Line Items */}
                      {expanded.has(inv.id) && (
                        <div className="border-t border-gray-200 bg-gray-50 p-4">
                          <h4 className="font-medium text-gray-800 mb-3">Line Items</h4>
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
                                {inv.lineItems.map((item) => (
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
                          {inv.matchedPO && (
                            <div className="mt-3 text-sm text-gray-600">
                              <span className="font-medium">Matched PO:</span> {inv.matchedPO}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>


          {/* Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Total Invoices */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 text-center">
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
                <p className="text-sm text-gray-600">Total Invoices</p>
              </div>

              {/* Matched */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {invoices.filter(inv => getStatusGroup(inv.status) === "Matched").length}
                </p>
                <p className="text-sm text-gray-600">Matched</p>
              </div>

              {/* Discrepancy */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {invoices.filter(inv => getStatusGroup(inv.status) === "Discrepancy").length}
                </p>
                <p className="text-sm text-gray-600">Discrepancies</p>
              </div>

              {/* Failed */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 text-center">
                <p className="text-2xl font-bold text-red-600">
                  {invoices.filter(inv => getStatusGroup(inv.status) === "Failed").length}
                </p>
                <p className="text-sm text-gray-600">Failed / Unmatched</p>
              </div>

              {/* Total Value */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  ${invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
