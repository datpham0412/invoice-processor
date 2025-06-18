import React, { useEffect, useState } from 'react';
import api from '../api/api';

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
    <div className="container">
      <h2>My Invoices</h2>
      {rows.length === 0 ? (
        <p>No invoices yet.</p>
      ) : (
        <>
          <table border="1" cellPadding="6" style={{ width: '100%', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Vendor</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(inv => {
                const isOpen = expandedRow === inv.id;
                const lineData = inv.lineItems?.length ? inv.lineItems
                               : linesCache[inv.id] ? linesCache[inv.id]
                               : [];

                return (
                  <React.Fragment key={inv.id}>
                    {/* main row */}
                    <tr onClick={() => toggleRow(inv)} style={{ cursor: 'pointer' }}>
                      <td>{inv.invoiceNumber}</td>
                      <td>{inv.vendorName}</td>
                      <td>${inv.totalAmount.toFixed(2)}</td>
                      <td>{inv.status}</td>
                      <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={e => { 
                            e.stopPropagation(); 
                            setSelectedInvoice(selectedInvoice?.id === inv.id ? null : inv); 
                          }}
                          style={{ marginRight: '8px' }}
                        >
                          {selectedInvoice?.id === inv.id ? 'Hide PDF' : 'View PDF'}
                        </button>
                        <button 
                          onClick={e => { e.stopPropagation(); handleDownload(inv); }}
                          style={{ marginLeft: '8px' }}
                        >
                          Download
                        </button>
                      </td>
                    </tr>

                    {/* expandable detail row */}
                    {isOpen && (
                      <tr>
                        <td colSpan={6} style={{ background: '#f9f9f9' }}>
                          {lineData.length === 0
                            ? <em>No line items</em>
                            : (
                              <table border="1" cellPadding="4" style={{ width: '100%' }}>
                                <thead>
                                  <tr>
                                    <th>Description</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {lineData.map(item => (
                                    <tr key={item.id}>
                                      <td>{item.description}</td>
                                      <td>{item.quantity}</td>
                                      <td>${item.unitPrice.toFixed(2)}</td>
                                      <td>${item.amount.toFixed(2)}</td>
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

          {selectedInvoice && (
            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px' }}>
              <h3>Invoice Preview: {selectedInvoice.invoiceNumber}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <strong>Vendor:</strong> {selectedInvoice.vendorName}
                  <br />
                  <strong>Total:</strong> ${selectedInvoice.totalAmount.toFixed(2)}
                  <br />
                  <strong>Date:</strong> {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}
                </div>
                <button onClick={() => setSelectedInvoice(null)}>Close Preview</button>
              </div>
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="600"
                  title={`Invoice ${selectedInvoice.invoiceNumber}`}
                  style={{ border: '1px solid #ddd' }}
                />
              ) : (
                <p>Loading PDF preview...</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 