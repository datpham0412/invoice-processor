import React, { useState } from 'react';

function PurchaseOrderForm({ onSubmit, isLoading }) {
  const [poNumber, setPoNumber] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [lineItems, setLineItems] = useState([
    { description: '', quantity: 1, unitPrice: 0 }
  ]);

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...lineItems];
    newItems[index][field] = value;
    setLineItems(newItems);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeLineItem = (index) => {
    if (lineItems.length > 1) {
      const newItems = lineItems.filter((_, i) => i !== index);
      setLineItems(newItems);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      poNumber,
      vendorName,
      issueDate,
      lineItems: lineItems.map(item => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice)
      }))
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-3xl mx-auto space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          PO Number:
        </label>
        <input
          value={poNumber}
          onChange={e => setPoNumber(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vendor Name:
        </label>
        <input
          value={vendorName}
          onChange={e => setVendorName(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Issue Date:
        </label>
        <input
          type="date"
          value={issueDate}
          onChange={e => setIssueDate(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Line Items</h3>
        {lineItems.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4">
            <input
              placeholder="Description"
              value={item.description}
              onChange={e => handleLineItemChange(index, 'description', e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-md w-full"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={e => handleLineItemChange(index, 'quantity', e.target.value)}
              required
              min="0"
              step="0.01"
              className="p-3 border border-gray-300 rounded-md w-full"
            />
            <input
              type="number"
              placeholder="Unit Price"
              value={item.unitPrice}
              onChange={e => handleLineItemChange(index, 'unitPrice', e.target.value)}
              required
              min="0"
              step="0.01"
              className="p-3 border border-gray-300 rounded-md w-full"
            />
            {lineItems.length > 1 && (
              <button
                type="button"
                onClick={() => removeLineItem(index)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          type="button"
          onClick={addLineItem}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition"
        >
          Add Line Item
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition disabled:opacity-60"
        >
          {isLoading ? 'Submitting...' : 'Submit PO'}
        </button>
      </div>
    </form>
  );
}

export default PurchaseOrderForm;
