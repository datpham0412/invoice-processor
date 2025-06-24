import React, { useState } from 'react';
import PurchaseOrderForm from '../components/PurchaseOrderForm'; // Adjust import path as needed
import api from '../api/api'; // Axios wrapper

export default function CreatePOPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setIsLoading(true);
    try {
      const res = await api.post('/purchaseorders', payload);
      alert('Purchase Order submitted successfully!');
      console.log('Response:', res.data);
    } catch (err) {
      console.error('Failed to submit PO', err);
      alert('Failed to submit purchase order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PurchaseOrderForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
