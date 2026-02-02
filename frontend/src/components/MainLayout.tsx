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
          <Link to="/" className="logo">VeriTix</Link>
          <nav className="nav-links">
            <Link to="/marketplace">Sự kiện</Link>
            <Link to="/organizer/create">Tổ chức</Link>
            <Link to="/my-tickets">Vé của tôi</Link>
          </nav>
          <button className="btn btn-primary" style={{padding: '8px 16px', fontSize: '0.9rem'}}>
            Kết nối Ví
          </button>
        </div>
      </header>

      <main className="layout-main container">
        {children}
      </main>

      <footer className="layout-footer">
        <p>&copy; 2026 VeriTix - Nền tảng vé NFT uy tín bảo mật hàng đầu.</p>
      </footer>
    </div>
  );
};

export default MainLayout;