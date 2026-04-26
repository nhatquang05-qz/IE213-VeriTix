import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext' // THÊM DÒNG NÀY

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* BỌC DÒNG NÀY */}
      <App />
    </AuthProvider> {/* BỌC DÒNG NÀY */}
  </React.StrictMode>
);
