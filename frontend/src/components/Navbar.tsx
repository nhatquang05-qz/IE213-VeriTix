import React, { useState, useEffect } from 'react';
import "../assets/styles/Homepage.css";
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ children }: { children: React.ReactNode }) => {
<<<<<<< Updated upstream
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleConnectWallet = () => {
    console.log('Connect Wallet clicked');
    // TODO: Implement wallet connection logic
  };
=======

  const { walletAddress, connectWallet } = useAuth();
>>>>>>> Stashed changes

  return (
    <div>
      <nav>
        <div className="container">
          <div className="nav-content">
            <div className="logo-container">
              <img
                src="/src/assets/images/Logo VeriTix.png"
                alt="VeriTix Logo"
                className="logo-image"
              />
              <div className="logo">VeriTix</div>
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
              <a href="#" className="nav-link">
                Trang Chủ
              </a>
              <a href="#" className="nav-link">
                Sự Kiện
              </a>
              <a href="#" className="nav-link">
                Vé Của Tôi
              </a>
<<<<<<< Updated upstream
              <button 
                className="nav-link"
                onClick={handleConnectWallet}
                style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
              >
                Connect Wallet
              </button>
=======

              {/* GHÉP NỐI THẦN THÁNH NẰM Ở ĐÂY */}
              {walletAddress ? (
                /* Nếu có ví rồi -> Hiện địa chỉ ví (cắt ngắn cho đẹp) */
                <button className="nav-cta" style={{ background: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </button>
              ) : (
                /* Nếu chưa có ví -> Hiện nút kết nối và gắn sự kiện onClick */
                <button 
                  onClick={connectWallet} 
                  className="nav-cta"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  Kết Nối Ví
                </button>
              )}

>>>>>>> Stashed changes
              <a href="#" className="nav-cta">
                Bắt Đầu
              </a>
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