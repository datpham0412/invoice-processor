import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { invoiceStatusMap, statusColorMap } from '../invoiceStatusMap';

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const invoice = state?.invoiceData;
  const [blobUrl, setBlobUrl] = useState(null);

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-700 mb-4">No invoice data found. Please upload an invoice first.</p>
          <button
            onClick={() => navigate('/upload-invoice')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
          >
            Go to Upload Page
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    let localUrl;
    async function fetchPdf() {
      const res = await api.get(invoice.blobUrl, { responseType: 'blob' });
      localUrl = URL.createObjectURL(res.data);
      setBlobUrl(localUrl);
    }
    fetchPdf();
    return () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, [invoice.blobUrl]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Invoice Processing Result</h1>
        <h2 className="text-lg text-gray-700 font-medium mb-6 text-center">
        Status: <span className={`font-semibold ${statusColorMap[invoice.status] || ""}`}>
        {invoiceStatusMap[invoice.status] || invoice.status}
      </span>
        </h2>

        {blobUrl && (
          <div className="mb-6">
            <object
              data={blobUrl}
              type="application/pdf"
              className="w-full h-[600px] border border-gray-300 rounded-md"
            >
              <p className="text-center mt-2">
                Preview unavailable.{' '}
                <a
                  href={blobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  Download PDF
                </a>
              </p>
            </object>
          </div>
        )}

        {invoice.failureReason && (
          <div
            className={`
              p-4 rounded-md mb-6 border
              ${invoice.status === "Matched" || invoice.status === "MatchedByInvoiceNumber"
                ? "bg-green-100 border-green-300 text-green-700"
                : invoice.status === "Discrepancy"
                ? "bg-yellow-100 border-yellow-300 text-yellow-700"
                : "bg-red-100 border-red-300 text-red-700"}
            `}
          >
            <h3 className="font-semibold mb-2">
              {invoice.status === "Matched" || invoice.status === "MatchedByInvoiceNumber"
                ? "Success"
                : invoice.status === "Discrepancy"
                ? "Discrepancy"
                : "Processing Error"}
            </h3>
            <p>{invoice.failureReason}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/upload-invoice')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition"
          >
            Upload Another Invoice
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
          >
            Create New PO
          </button>
        </div>
      </div>
    </div>
  );
}
