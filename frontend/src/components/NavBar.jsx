import { Link } from 'react-router-dom';
import { logout } from '../api/logout';

export default function NavBar() {
  return (
    <nav className="bg-gray-100 px-4 py-3 shadow-sm mb-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/"
            className="text-blue-600 hover:underline hover:text-blue-800 font-medium"
          >
            Create PO
          </Link>
          <Link
            to="/upload-invoice"
            className="text-blue-600 hover:underline hover:text-blue-800 font-medium"
          >
            Upload Invoice
          </Link>
          <Link
            to="/invoices"
            className="text-blue-600 hover:underline hover:text-blue-800 font-medium"
          >
            My Invoices
          </Link>
          <Link
            to="/purchase-orders"
            className="text-blue-600 hover:underline hover:text-blue-800 font-medium"
          >
            My POs
          </Link>
        </div>
        <button
          onClick={logout}
          className="text-red-600 hover:text-red-800 font-medium underline"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
