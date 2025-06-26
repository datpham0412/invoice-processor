import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import CreatePOPage from './pages/CreatePOPage';
import UploadInvoicePage from './pages/UploadInvoicePage';
import ResultPage from './pages/ResultPage';
import InvoicesPage from './pages/InvoicesPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import { Toaster } from './components/ui/sonner';
import DashboardPage from './pages/DashboardPage';

// Wrapper for protecting routes
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth" replace />;
};

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = token ? JSON.parse(atob(token.split('.')[1]))?.unique_name : null;

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected routes */}
        <Route
          path="/create-po"
          element={
            <RequireAuth>
              <CreatePOPage />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
