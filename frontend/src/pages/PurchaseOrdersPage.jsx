import { useEffect, useState } from 'react';
import api from '../api/api';

export default function PurchaseOrdersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/purchaseorders')
       .then(res => setRows(res.data))
       .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h2>My Purchase Orders</h2>
      {rows.length === 0 ? (
        <p>No POs yet.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>#</th><th>Vendor</th><th>Total</th><th>Issue Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(po => (
              <tr key={po.id}>
                <td>{po.poNumber}</td>
                <td>{po.vendorName}</td>
                <td>${po.totalAmount.toFixed(2)}</td>
                <td>{new Date(po.issueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 