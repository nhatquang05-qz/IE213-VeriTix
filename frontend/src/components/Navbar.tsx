import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
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
      <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 navbar-container">
        <div className="navbar-background"></div>
        <div className="navbar-gradient"></div>

        <div className="max-w-7xl mx-auto px-6 py-4 relative z-10">
          
          {/* GRID 3 CỘT */}
          <div className="grid grid-cols-3 items-center w-full">

            {/* LEFT - Logo */}
            <div className="flex items-center gap-3">
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

            {/* CENTER - Menu + Search */}
            <div
              className={`flex items-center justify-center gap-6 flex-nowrap ${
                mobileMenuOpen ? 'navbar-mobile-menu active' : ''
              }`}
            >
              {/* Search */}
              <div className="hidden xl:flex navbar-search flex-shrink-0">
                <input
                  type="text"
                  className="navbar-search-input"
                  placeholder="Tìm sự kiện..."
                />
              </div>

              {/* Menu */}
              <div className="flex items-center gap-6 whitespace-nowrap">
                <Link to="/" className="navbar-nav-link whitespace-nowrap">
                  Trang Chủ
                </Link>

                <Link to="/about-us" className="navbar-nav-link whitespace-nowrap">
                  About Us
                </Link>

                {walletAddress && (
                  <Link
                    to="/user/my-tickets"
                    className="navbar-nav-link navbar-nav-link-ticket whitespace-nowrap"
                  >
                    Vé Của Tôi
                  </Link>
                )}

                <Link to="/organizer" className="navbar-nav-link whitespace-nowrap">
                  Dashboard
                </Link>
              </div>
            </div>

            {/* RIGHT - Actions */}
            <div className="flex justify-end items-center gap-3">
              {!walletAddress ? (
                <button 
                  onClick={connectWallet} 
                  className="navbar-btn-wallet whitespace-nowrap"
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

              <Link 
                to="/organizer/events/create" 
                className="navbar-btn-primary whitespace-nowrap"
              >
                Bắt Đầu
              </Link>
            </div>

          </div>

          {/* Mobile Toggle */}
          {isMobile && (
            <button 
              className="navbar-mobile-toggle absolute right-6 top-1/2 -translate-y-1/2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="navbar-hamburger"></span>
              <span className="navbar-hamburger"></span>
              <span className="navbar-hamburger"></span>
            </button>
          )}

        </div>
      </nav>
      
      <main className="pt-24">
        {children}
      </main>
    </div>
  );
};

export default Navbar;