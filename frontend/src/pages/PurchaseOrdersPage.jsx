import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function PurchaseOrdersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);      // PO ID or null
  const [linesCache, setLinesCache] = useState({});         // { id: [ ...lineItems ] }

  useEffect(() => {
    api.get('/purchaseorders')
       .then(res => setRows(res.data))
       .finally(() => setLoading(false));
  }, []);

  async function toggleRow(po) {
    // collapse if clicking the same row
    if (expandedRow === po.id) {
      setExpandedRow(null);
      return;
    }

    // if we already have the lines (either cached or included), just expand
    if (po.lineItems?.length || linesCache[po.id]) {
      setExpandedRow(po.id);
      return;
    }

    // otherwise fetch them once
    try {
      const { data } = await api.get(`/purchaseorders/${po.id}/items`);
      setLinesCache(prev => ({ ...prev, [po.id]: data }));
      setExpandedRow(po.id);
    } catch (err) {
      console.error('Could not load line items', err);
      alert('Failed to load items');
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="container">
      <h2>My Purchase Orders</h2>
      {rows.length === 0 ? (
        <p>No POs yet.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ width: '100%', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Vendor</th>
              <th>Total</th>
              <th>Issue Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(po => {
              const isOpen = expandedRow === po.id;
              const lineData = po.lineItems?.length ? po.lineItems
                             : linesCache[po.id] ? linesCache[po.id]
                             : [];

              return (
                <React.Fragment key={po.id}>
                  {/* main row */}
                  <tr onClick={() => toggleRow(po)} style={{ cursor: 'pointer' }}>
                    <td>{po.poNumber}</td>
                    <td>{po.vendorName}</td>
                    <td>${po.totalAmount.toFixed(2)}</td>
                    <td>{new Date(po.issueDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={e => { 
                          e.stopPropagation(); 
                          // Add any actions you want here
                        }}
                        style={{ marginRight: '8px' }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>

                  {/* expandable detail row */}
                  {isOpen && (
                    <tr>
                      <td colSpan={5} style={{ background: '#f9f9f9' }}>
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
      )}
    </div>
  );
} 