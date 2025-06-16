import React, { useState } from 'react';
import './App.css';

function App() {
  const [poNumber, setPoNumber] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [lineItems, setLineItems] = useState([
    { description: '', quantity: 1, unitPrice: 0 }
  ]);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const submitPO = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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

    try {
      const res = await fetch('https://localhost:7248/api/purchaseorders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit PO');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Create Purchase Order</h1>
      <form onSubmit={submitPO} className="form">
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

export default App;

