import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function UploadInvoicePage() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/invoices/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResponse(data);
      // Navigate to result page after successful upload
      navigate('/result', { state: { invoiceData: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload invoice');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Upload Invoice</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>
            Select PDF Invoice:
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="form-control"
              required
            />
          </label>
        </div>

        <div className="button-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !file}
          >
            {isLoading ? 'Uploading...' : 'Upload Invoice'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {response && (
        <div className="response-section">
          <h3>Upload Response</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UploadInvoicePage; 