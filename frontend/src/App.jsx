import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreatePOPage from './pages/CreatePOPage';
import UploadInvoicePage from './pages/UploadInvoicePage';
import ResultPage from './pages/ResultPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreatePOPage />} />
      <Route path="/upload-invoice" element={<UploadInvoicePage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}

export default App;

