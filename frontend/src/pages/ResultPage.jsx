import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceData = location.state?.invoiceData;

  if (!invoiceData) {
    return (
      <div className="container">
        <div className="error-message">
          No invoice data found. Please upload an invoice first.
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/upload-invoice')}
        >
          Go to Upload Page
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Invoice Processing Result</h1>
      
      <div className="result-section">
        <h2>Status: {invoiceData.status}</h2>
        
        {invoiceData.blobUrl && (
          <div className="preview-section">
            <h3>Invoice Preview</h3>
            <iframe 
              src={invoiceData.blobUrl} 
              title="Invoice Preview"
              className="pdf-preview"
            />
          </div>
        )}

        {invoiceData.failureReason && (
          <div className="error-message">
            <h3>Processing Error</h3>
            <p>{invoiceData.failureReason}</p>
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
    </div>
  );
}

export default ResultPage; 