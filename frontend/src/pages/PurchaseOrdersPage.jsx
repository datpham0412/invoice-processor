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
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Purchase Orders</h2>

        {rows.length === 0 ? (
          <p className="text-gray-600">No POs yet.</p>
        ) : (
          <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 border-b text-xs uppercase font-semibold text-gray-600">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Issue Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((po) => {
                  const isOpen = expandedRow === po.id;
                  const lineData =
                    po.lineItems?.length || linesCache[po.id]
                      ? po.lineItems || linesCache[po.id]
                      : [];

                  return (
                    <React.Fragment key={po.id}>
                      {/* Main row */}
                      <tr className="hover:bg-gray-50 border-b">
                        <td className="px-4 py-2">{po.poNumber}</td>
                        <td className="px-4 py-2">{po.vendorName}</td>
                        <td className="px-4 py-2">${po.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-2">
                          {new Date(po.issueDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(po);
                          }}
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          {isOpen ? 'Hide Details' : 'View Details'}
                        </button>
                        </td>
                      </tr>

                      {/* Expandable detail row */}
                      {isOpen && (
                        <tr className="bg-gray-50 border-t">
                        <td colSpan="5" className="px-4 py-4">
                          <div className="rounded-md border border-gray-200 p-4 bg-white shadow-sm">
                            {lineData.length === 0 ? (
                              <em className="text-gray-500">No line items</em>
                            ) : (
                              <table className="w-full text-sm text-left text-gray-700">
                                <thead className="bg-gray-100 text-xs uppercase text-gray-600 font-medium">
                                  <tr>
                                    <th className="px-4 py-2">Description</th>
                                    <th className="px-4 py-2">Qty</th>
                                    <th className="px-4 py-2">Unit Price</th>
                                    <th className="px-4 py-2">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {lineData.map((item) => (
                                    <tr key={item.id} className="border-t">
                                      <td className="px-4 py-2">{item.description}</td>
                                      <td className="px-4 py-2">{item.quantity}</td>
                                      <td className="px-4 py-2">${item.unitPrice.toFixed(2)}</td>
                                      <td className="px-4 py-2">${item.amount.toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </td>
                      </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 