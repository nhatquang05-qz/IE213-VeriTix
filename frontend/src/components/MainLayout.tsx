import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/layout.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <header className="layout-header">
        <div className="container header-content">
          <Link to="/" className="logo">
            VeriTix
          </Link>

          <nav className="nav-links">
            <Link to="/events">Sự kiện</Link>
            <Link to="/create-event">Tổ chức</Link>
            <Link to="/my-tickets">Vé của tôi</Link>
          </nav>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link
              to="/login"
              className="btn btn-outline"
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      <main className="layout-main container">{children}</main>

      <footer className="layout-footer">
        <p>&copy; 2026 VeriTix.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
