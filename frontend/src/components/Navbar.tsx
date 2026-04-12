import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../assets/styles/Homepage.css";
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { connectWallet, walletAddress } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div>
      <nav>
        <div className="container">
          <div className="nav-content">
            <div className="logo-container">
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img
                  src="/src/assets/images/Logo VeriTix.png"
                  alt="VeriTix Logo"
                  className="logo-image"
                />
                <div className="logo">VeriTix</div>
              </Link>
            </div>
            <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm kiếm sự kiện, nghệ sĩ, địa điểm..."
                />
                <button className="search-btn">
                  <svg
                    className="search-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              
              <Link to="/" className="nav-link">Trang Chủ</Link>
              <Link to="/organizer-dashboard" className="nav-link">Dashboard</Link>
              <Link to="/create-event" className="nav-link">Tạo Sự Kiện</Link>

              {!walletAddress ? (
                <button onClick={connectWallet} className="connect-btn" style={{ background: '#f3f4f6', color: 'black', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold' }}>
                  Kết Nối Ví
                </button>
              ) : (
                <span className="wallet-address" style={{ background: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold' }}>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              )}

              {/* Nút Bắt Đầu trỏ thẳng tới trang tạo sự kiện */}
              <Link to="/create-event" className="nav-cta">
                Bắt Đầu
              </Link>
            </div>
            {isMobile && (
              <button 
                className="nav-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            )}
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Navbar;