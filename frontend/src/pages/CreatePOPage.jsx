import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Trash2, ArrowLeft, CheckCircle, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/api";
import NavBar from "../components/NavBar";

export default function CreatePOPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [poNumber, setPoNumber] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [lineItems, setLineItems] = useState([{ description: "", quantity: 1, unitPrice: 0 }]);
  const [response, setResponse] = useState(null);
  const navigate = useNavigate()

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...lineItems];
    newItems[index][field] = value;
    setLineItems(newItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeLineItem = (index) => {
    if (lineItems.length > 1) {
      const newItems = lineItems.filter((_, i) => i !== index);
      setLineItems(newItems);
    }
  };

  const calculateTotal = () => {
    return lineItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        poNumber,
        vendorName,
        issueDate,
        lineItems: lineItems.map((item) => ({
          description: item.description,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
        })),
      };

      // Simulate API call
      const response = await api.post('/purchaseorders', payload)

      setResponse({
        success: true,
        poNumber,
        vendorName,
        totalAmount: calculateTotal(),
        createdAt: new Date().toISOString(),
        lineItemsCount: lineItems.length,
      });

      // No alert, no immediate reset
    } catch (err) {
      console.error("Failed to submit PO", err);
      alert("Failed to submit purchase order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <NavBar />
      
      <div className="p-4 lg:p-8">
        {/* Floating Elements */}
        <div className="fixed top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse pointer-events-none"></div>
        <div
          className="fixed bottom-20 right-20 w-40 h-40 bg-indigo-200/30 rounded-full blur-xl animate-pulse pointer-events-none"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-sm">
              <div className="px-8 py-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Create Purchase Order</h1>
                  <p className="text-blue-100 text-sm">Generate a new purchase order for your vendor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Purchase Order Details</CardTitle>
              <CardDescription>Fill in the information below to create a new purchase order</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="poNumber" className="text-sm font-medium text-gray-700">
                      PO Number *
                    </Label>
                    <Input
                      id="poNumber"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      placeholder="Enter PO number"
                      required
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendorName" className="text-sm font-medium text-gray-700">
                      Vendor Name *
                    </Label>
                    <Input
                      id="vendorName"
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      placeholder="Enter vendor name"
                      required
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueDate" className="text-sm font-medium text-gray-700">
                    Issue Date *
                  </Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 max-w-xs"
                  />
                </div>

                {/* Line Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Line Items</h3>
                    <Button
                      type="button"
                      onClick={addLineItem}
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {lineItems.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2 space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Description *</Label>
                            <Input
                              placeholder="Item description"
                              value={item.description}
                              onChange={(e) => handleLineItemChange(index, "description", e.target.value)}
                              required
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Quantity *</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={item.quantity}
                              onChange={(e) =>
                                handleLineItemChange(index, "quantity", Number.parseFloat(e.target.value) || 0)
                              }
                              required
                              min="0"
                              step="0.01"
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Unit Price *</Label>
                            <div className="flex">
                            <Input
                              type="text"
                              inputMode="decimal"
                              placeholder="0.00"
                              value={item.unitPrice}
                              onChange={e => handleLineItemChange(index, "unitPrice", e.target.value)}
                              onBlur={() => {
                                const num = parseFloat(item.unitPrice);
                                handleLineItemChange(
                                  index,
                                  "unitPrice",
                                  isNaN(num) ? "" : num.toFixed(2)
                                );
                              }}
                              required
                              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                              {lineItems.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removeLineItem(index)}
                                  variant="outline"
                                  size="icon"
                                  className="ml-2 border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Line Total */}
                        <div className="mt-3 text-right">
                          <span className="text-sm text-gray-600">
                            Line Total: {" "}
                            <span className="font-semibold">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-end">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        Total Amount: <span className="text-blue-600">${calculateTotal().toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Submit Purchase Order
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Ready for Invoice Upload Section */}
              {response && (
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Purchase Order Created Successfully!</h4>
                        <p className="text-gray-600 text-sm">
                          PO {response.poNumber} is ready. You can now upload invoices to match against this purchase order.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to="/upload-invoice">
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02]">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Invoice
                        </Button>
                      </Link>
                      <Link to="/purchase-orders">
                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 bg-transparent"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View All POs
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-4 pt-4 border-t border-blue-200/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-white/60 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{response.poNumber}</div>
                        <div className="text-xs text-gray-600">PO Number</div>
                      </div>
                      <div className="text-center p-3 bg-white/60 rounded-lg">
                        <div className="text-lg font-bold text-green-600">${response.totalAmount.toFixed(2)}</div>
                        <div className="text-xs text-gray-600">Total Amount</div>
                      </div>
                      <div className="text-center p-3 bg-white/60 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{response.lineItemsCount}</div>
                        <div className="text-xs text-gray-600">Line Items</div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="mt-4 pt-4 border-t border-blue-200/50">
                    <h5 className="font-semibold text-gray-700 mb-2">Next Steps:</h5>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">1</span>
                        </div>
                        <span>Upload invoices from {response.vendorName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">2</span>
                        </div>
                        <span>Let our AI automatically match invoices to this PO</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">3</span>
                        </div>
                        <span>Review and approve matched results</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
