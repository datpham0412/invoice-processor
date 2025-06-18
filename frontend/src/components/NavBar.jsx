import { Link } from 'react-router-dom';
import { logout } from '../api/logout';

export default function NavBar() {
  return (
    <nav style={{ padding: '10px', background: '#eee', marginBottom: 16 }}>
      <Link to="/"               style={{ marginRight: 12 }}>Create PO</Link>
      <Link to="/upload-invoice" style={{ marginRight: 12 }}>Upload Invoice</Link>
      <Link to="/invoices"       style={{ marginRight: 12 }}>My Invoices</Link>
      <Link to="/purchase-orders"style={{ marginRight: 12 }}>My POs</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
} 