import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MdConfirmationNumber } from 'react-icons/md';

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
      <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 navbar-container">
        <div className="navbar-background"></div>
        <div className="navbar-gradient"></div>
        <div className="max-w-7xl mx-auto px-6 py-4 relative z-10">
          <div className="flex justify-between items-center gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3 whitespace-nowrap flex-shrink-0 group">
              <Link to="/" className="flex items-center gap-3 no-underline">
                <div className="navbar-logo-wrapper">
                  <img
                    src="/src/assets/images/Logo VeriTix.png"
                    alt="VeriTix Logo"
                    className="navbar-logo-img"
                  />
                </div>
                <div className="navbar-brand-text">
                  VeriTix
                </div>
              </Link>
            </div>

            {/* Menu Links & Actions */}
            <div className={`flex items-center gap-8 ${mobileMenuOpen ? 'navbar-mobile-menu active' : 'navbar-desktop-menu'}`}>
              
              {/* Search Bar */}
              <div className="hidden xl:block navbar-search">
                <input
                  type="text"
                  className="navbar-search-input"
                  placeholder="Tìm sự kiện..."
                />
                <svg className="navbar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              
              {/* Navigation Links */}
              <div className="navbar-nav-links">
                <Link to="/" className="navbar-nav-link">
                  Trang Chủ
                </Link>

                <Link to="/about-us" className="navbar-nav-link">
                  About Us
                </Link>
                
                {walletAddress && (
                  <Link to="/user/my-tickets" className="navbar-nav-link navbar-nav-link-ticket">
                    <MdConfirmationNumber className="text-cyan-400" />
                    Vé Của Tôi
                  </Link>
                )}

                <Link to="/organizer" className="navbar-nav-link">
                  Dashboard
                </Link>
              </div>

              {/* Wallet & CTA Area */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {!walletAddress ? (
                  <button 
                    onClick={connectWallet} 
                    className="navbar-btn-wallet"
                  >
                    Kết Nối Ví
                  </button>
                ) : (
                  <div className="navbar-wallet-badge">
                    <div className="navbar-wallet-dot"></div>
                    <span className="navbar-wallet-address">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                )}

                <Link to="/organizer/events/create" className="navbar-btn-primary">
                  Bắt Đầu
                </Link>
              </div>
            </div>

            {/* Mobile Toggle */}
            {isMobile && (
              <button 
                className="navbar-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="navbar-hamburger"></span>
                <span className="navbar-hamburger"></span>
                <span className="navbar-hamburger"></span>
              </button>
            )}
          </div>
        </div>
      </nav>
      
      <main className="pt-24">
        {children}
      </main>
    </div>
  );
};

export default Navbar;