import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CreatePOPage from './pages/CreatePOPage';
import UploadInvoicePage from './pages/UploadInvoicePage';
import ResultPage from './pages/ResultPage';
import LoginPage from './pages/LoginPage';
import './App.css';

// Wrapper for protecting routes
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public login route */}
      <Route path="/login" element={<LoginPage />} />

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

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
