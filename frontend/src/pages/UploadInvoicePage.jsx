import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Upload, ArrowLeft, AlertCircle, X, CheckCircle, FileText } from "lucide-react";
import api from "@/api/api";
import NavBar from "../components/NavBar";

export default function UploadInvoicePage() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (selectedFile) => {
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileChange(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/invoices/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Set response for display
      setResponse({
        success: true,
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        invoiceData: data
      });

      // Navigate to results page after a short delay
      setTimeout(() => {
        navigate("/result", { state: { invoiceData: data } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload invoice");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <NavBar />
      
      <div className="p-4 lg:p-8">
        {/* Floating Elements */}
        <div className="fixed top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse pointer-events-none" />
        <div
          className="fixed bottom-20 right-20 w-40 h-40 bg-indigo-200/30 rounded-full blur-xl animate-pulse pointer-events-none"
          style={{ animationDelay: "1s" }}
        />

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-sm">
              <div className="px-8 py-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">Upload Invoice</h1>
                  <p className="text-indigo-100 text-sm">Upload your PDF invoice for processing and matching</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Invoice Upload</CardTitle>
              <CardDescription>Select or drag and drop your PDF invoice file to upload and process</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload Area */}
                <div className="space-y-4">
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                      isDragOver
                        ? "border-indigo-400 bg-indigo-50"
                        : file
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleInputChange}
                      className="hidden"
                      required
                    />

                    {!file ? (
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-700 mb-2">
                            {isDragOver ? "Drop your file here" : "Upload your invoice"}
                          </p>
                          <p className="text-sm text-gray-500">Drag and drop your PDF file here, or click to browse</p>
                          <p className="text-xs text-gray-400 mt-2">Only PDF files are supported</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <FileText className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-700 mb-1">File Selected</p>
                          <p className="text-sm text-gray-600">{file.name}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove File
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* File Details */}
                  {file && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2">File Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Name:</span>
                          <p className="font-medium">{file.name}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <p className="font-medium">{formatFileSize(file.size)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium">PDF Document</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Modified:</span>
                          <p className="font-medium">{new Date(file.lastModified).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Success Response */}
                {response && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <p className="text-green-700 text-sm font-medium">Invoice uploaded successfully!</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Upload Details</h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="text-gray-500">Filename:</span> {response.filename}
                        </p>
                        <p>
                          <span className="text-gray-500">Uploaded:</span>{" "}
                          {new Date(response.uploadedAt).toLocaleString()}
                        </p>
                        <p>
                          <span className="text-gray-500">Status:</span>{" "}
                          <span className="text-green-600 font-medium">Processing</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading || !file}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Invoice
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          {/* Upload Tips */}
          <Card className="mt-8 bg-white/60 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Upload Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Only PDF files are accepted for processing</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Maximum file size is 10MB</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Ensure text is clear and readable</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Processing typically takes 30-60 seconds</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
