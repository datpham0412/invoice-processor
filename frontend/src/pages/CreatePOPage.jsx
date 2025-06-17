import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PurchaseOrderForm from '../components/PurchaseOrderForm';
import api from '../api/api';

function CreatePOPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.post('/purchaseorders', payload);
      setResponse(data);
      // Navigate to upload invoice page after successful PO creation
      navigate('/upload-invoice');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit PO');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Create Purchase Order</h1>
      <PurchaseOrderForm onSubmit={handleSubmit} isLoading={isLoading} />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {response && (
        <div className="response-section">
          <h3>Response</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default CreatePOPage; 