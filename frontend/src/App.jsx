import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import CreatePOPage from './pages/CreatePOPage';
import UploadInvoicePage from './pages/UploadInvoicePage';
import ResultPage from './pages/ResultPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import InvoicesPage from './pages/InvoicesPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import NavBar from './components/NavBar';
import './App.css';

// Wrapper for protecting routes
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = token ? JSON.parse(atob(token.split('.')[1]))?.unique_name : null;

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {token && <NavBar />}
      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <CreatePOPage />
            </RequireAuth>
          }
        />
        <Route
          path="/upload-invoice"
          element={
            <RequireAuth>
              <UploadInvoicePage />
            </RequireAuth>
          }
        />
        <Route
          path="/result"
          element={
            <RequireAuth>
              <ResultPage />
            </RequireAuth>
          }
        />
        <Route
          path="/invoices"
          element={
            <RequireAuth>
              <InvoicesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/purchase-orders"
          element={
            <RequireAuth>
              <PurchaseOrdersPage />
            </RequireAuth>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
