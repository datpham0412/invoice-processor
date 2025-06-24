import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { invoiceStatusMap, statusColorMap } from '../invoiceStatusMap';

export default function InvoicesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);      // invoice ID or null
  const [linesCache, setLinesCache] = useState({});         // { id: [ ...lineItems ] }

  useEffect(() => {
    api.get('/invoices')
       .then(res => setRows(res.data))
       .finally(() => setLoading(false));
  }, []);

  // Handle PDF preview
  useEffect(() => {
    if (!selectedInvoice) {
      setPdfUrl(null);
      return;
    }

    let localUrl;
    api.get(selectedInvoice.blobUrl, { responseType: 'blob' })
       .then(r => {
         localUrl = URL.createObjectURL(r.data);
         setPdfUrl(localUrl);
       })
       .catch(err => {
         console.error('Failed to load PDF:', err);
         setPdfUrl(null);
       });

    return () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, [selectedInvoice]);

  async function handleDownload(inv) {
    try {
      const res = await api.get(inv.blobUrl, { responseType: 'blob' });
      const href = URL.createObjectURL(res.data);

      const link = document.createElement('a');
      link.href = href;
      // nice file name e.g. "PO-1238.pdf"
      link.download = inv.invoiceNumber ? `${inv.invoiceNumber}.pdf` : 'invoice.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error('Download failed', err);
      alert('Could not download file');
    }
  }

  async function toggleRow(inv) {
    // collapse if clicking the same row
    if (expandedRow === inv.id) {
      setExpandedRow(null);
      return;
    }

    // if we already have the lines (either cached or included), just expand
    if (inv.lineItems?.length || linesCache[inv.id]) {
      setExpandedRow(inv.id);
      return;
    }

    // otherwise fetch them once
    try {
      const { data } = await api.get(`/invoices/${inv.id}/items`);
      setLinesCache(prev => ({ ...prev, [inv.id]: data }));
      setExpandedRow(inv.id);
    } catch (err) {
      console.error('Could not load line items', err);
      alert('Failed to load items');
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Invoices</h2>

    {rows.length === 0 ? (
      <p className="text-gray-600">No invoices yet.</p>
    ) : (
      <>
        <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 border-b text-xs uppercase font-semibold text-gray-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((inv) => {
                const isOpen = expandedRow === inv.id;
                const lineData =
                  inv.lineItems?.length || linesCache[inv.id]
                    ? inv.lineItems || linesCache[inv.id]
                    : [];

                return (
                  <React.Fragment key={inv.id}>
                    {/* Main row */}
                    <tr
                      onClick={() => toggleRow(inv)}
                      className="hover:bg-gray-50 cursor-pointer border-b"
                    >
                      <td className="px-4 py-2">{inv.invoiceNumber}</td>
                      <td className="px-4 py-2">{inv.vendorName}</td>
                      <td className="px-4 py-2">${inv.totalAmount.toFixed(2)}</td>
                      <td className={`px-4 py-2 font-semibold ${statusColorMap[inv.status] || ""}`}>
                        {invoiceStatusMap[inv.status] || inv.status}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(inv.invoiceDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvoice(selectedInvoice?.id === inv.id ? null : inv);
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            {selectedInvoice?.id === inv.id ? 'Hide PDF' : 'View PDF'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(inv);
                            }}
                            className="text-green-600 hover:underline"
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Detail row */}
                    {isOpen && (
                      <tr className="bg-gray-50 border-t">
                        <td colSpan="6" className="px-4 py-4">
                          {lineData.length === 0 ? (
                            <em className="text-gray-500">No line items</em>
                          ) : (
                            <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded">
                              <thead className="bg-gray-100 text-xs uppercase text-gray-600 font-medium">
                                <tr>
                                  <th className="px-4 py-2">Description</th>
                                  <th className="px-4 py-2">Qty</th>
                                  <th className="px-4 py-2">Unit Price</th>
                                  <th className="px-4 py-2">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {lineData.map((item) => (
                                  <tr key={item.id} className="border-t">
                                    <td className="px-4 py-2">{item.description}</td>
                                    <td className="px-4 py-2">{item.quantity}</td>
                                    <td className="px-4 py-2">${item.unitPrice.toFixed(2)}</td>
                                    <td className="px-4 py-2">${item.amount.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PDF Preview */}
        {selectedInvoice && (
          <div className="mt-8 p-6 border border-gray-300 rounded-lg bg-white shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Invoice Preview: {selectedInvoice.invoiceNumber}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Vendor:</strong> {selectedInvoice.vendorName} <br />
                  <strong>Total:</strong> ${selectedInvoice.totalAmount.toFixed(2)} <br />
                  <strong>Date:</strong>{' '}
                  {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Close Preview
              </button>
            </div>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                width="100%"
                height="600"
                title={`Invoice ${selectedInvoice.invoiceNumber}`}
                className="border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-gray-500">Loading PDF preview...</p>
            )}
          </div>
        )}
      </>
    )}
  </div>
</div>

  );
} 