import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import CreatePOPage from './pages/CreatePOPage';
import UploadInvoicePage from './pages/UploadInvoicePage';
import ResultPage from './pages/ResultPage';
import InvoicesPage from './pages/InvoicesPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import { Toaster } from './components/ui/sonner';
import api from './api/api';
import { scheduleProactiveRefresh, logoutAndRedirect } from './utils/tokenService';

// Wrapper for protecting routes
const RequireAuth = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  return accessToken ? children : <Navigate to="/auth" replace />;
};

function App() {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    scheduleProactiveRefresh();
  }, []);

  useEffect(() => {
    const onSuccess = response => {
      setIsRefreshing(false);
      return response;
    };
    const onError = error => {
      if (error.config?._retry) {
        setIsRefreshing(true);
      }
      setIsRefreshing(false);
      return Promise.reject(error);
    };

    const resInterceptor = api.interceptors.response.use(onSuccess, onError);
    return () => api.interceptors.response.eject(resInterceptor);
  }, []);

  const logout = () => {
    logoutAndRedirect();
  };

  if (isRefreshing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        <div className="loader">Loading…</div>
      </div>
    );
  }

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
