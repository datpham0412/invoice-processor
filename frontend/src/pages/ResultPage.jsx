import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function ResultPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const invoice   = state?.invoiceData;
  const [blobUrl, setBlobUrl] = useState(null);

  // redirect if someone reloads /result directly
  if (!invoice) {
    return (
      <div className="container">
        <p>No invoice data found. Please upload an invoice first.</p>
        <button className="btn btn-primary" onClick={() => navigate('/upload-invoice')}>
          Go to Upload Page
        </button>
      </div>
    );
  }

  /* ----- ONE effect, six lines ----- */
  useEffect(() => {
    let localUrl;
    async function fetchPdf() {
      const res   = await api.get(invoice.blobUrl, { responseType: 'blob' });
      localUrl    = URL.createObjectURL(res.data);
      setBlobUrl(localUrl);
    }
    fetchPdf();
    return () => { if (localUrl) URL.revokeObjectURL(localUrl); };
  }, [invoice.blobUrl]);
  /* ---------------------------------- */

  return (
    <div className="container">
      <h1>Invoice Processing Result</h1>
      <h2>Status: {invoice.status}</h2>

      {blobUrl && (
        <object
          data={blobUrl}
          type="application/pdf"
          width="100%"
          height="600"
        >
          {/* Fallback if the browser can't inline PDF */}
          <p>Preview unavailable. <a href={blobUrl} target="_blank" rel="noreferrer">Download PDF</a></p>
        </object>
      )}

      {invoice.failureReason && (
        <div className="error-message">
          <h3>Processing Error</h3>
          <p>{invoice.failureReason}</p>
        </div>
      )}

      <div className="button-group">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/upload-invoice')}
        >
          Upload Another Invoice
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          Create New PO
        </button>
      </div>
    </div>
  );
} 