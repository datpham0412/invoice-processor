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
      navigate('/result', { state: { invoiceData: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload invoice');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Invoice</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="invoice" className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF Invoice
            </label>
            <input
              id="invoice"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !file}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Uploading...' : 'Upload Invoice'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {response && (
          <div className="mt-6 bg-gray-100 p-4 rounded-md text-sm text-gray-800">
            <h3 className="font-semibold mb-2">Upload Response</h3>
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadInvoicePage;
