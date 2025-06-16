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
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label>
          PO Number:
          <input 
            value={poNumber} 
            onChange={e => setPoNumber(e.target.value)} 
            required 
            className="form-control"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Vendor Name:
          <input 
            value={vendorName} 
            onChange={e => setVendorName(e.target.value)} 
            required 
            className="form-control"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Issue Date:
          <input 
            type="date" 
            value={issueDate} 
            onChange={e => setIssueDate(e.target.value)} 
            required 
            className="form-control"
          />
        </label>
      </div>

      <h3>Line Items</h3>
      {lineItems.map((item, index) => (
        <div key={index} className="line-item">
          <input
            placeholder="Description"
            value={item.description}
            onChange={e => handleLineItemChange(index, 'description', e.target.value)}
            required
            className="form-control"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={item.quantity}
            onChange={e => handleLineItemChange(index, 'quantity', e.target.value)}
            required
            min="0"
            step="0.01"
            className="form-control"
          />
          <input
            type="number"
            placeholder="Unit Price"
            value={item.unitPrice}
            onChange={e => handleLineItemChange(index, 'unitPrice', e.target.value)}
            required
            min="0"
            step="0.01"
            className="form-control"
          />
          {lineItems.length > 1 && (
            <button 
              type="button" 
              onClick={() => removeLineItem(index)}
              className="btn btn-danger"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      
      <div className="button-group">
        <button type="button" onClick={addLineItem} className="btn btn-secondary">
          Add Line Item
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit PO'}
        </button>
      </div>
    </form>
  );
}

export default PurchaseOrderForm; 