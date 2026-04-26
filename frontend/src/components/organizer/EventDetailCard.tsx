import React from 'react'; 
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const { connectWallet, walletAddress } = useAuth();

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-[100] navbar-container">
        <div className="navbar-background"></div>
        <div className="navbar-gradient"></div>

        <div className="max-w-7xl mx-auto px-4 py-3 relative z-10">

          {/* ================= MOBILE ================= */}
          <div className="flex flex-col gap-3 lg:hidden">

            {/* ROW 1 */}
            <div className="flex items-center justify-between">

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 whitespace-nowrap">
                <img
                  src="/src/assets/images/Logo VeriTix.png"
                  className="navbar-logo-img"
                  alt="logo"
                />
                <span className="navbar-brand-text">VeriTix</span>
              </Link>

              {/* Actions */}
              <div className="flex items-center gap-2">

                {!walletAddress ? (
                  <button 
                    onClick={connectWallet} 
                    className="navbar-btn-wallet text-xs px-2 py-1 whitespace-nowrap"
                  >
                    Kết Nối Ví
                  </button>
                ) : (
                  <div className="navbar-wallet-badge text-xs whitespace-nowrap">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                )}

                <Link 
                  to="/organizer/events/create" 
                  className="navbar-btn-primary text-xs px-3 py-1 whitespace-nowrap"
                >
                  Bắt Đầu
                </Link>

              </div>
            </div>

            {/* ROW 2 - MENU */}
            <div className="flex justify-around items-center border-t border-white/10 pt-2 text-sm whitespace-nowrap">
              <Link to="/" className="navbar-nav-link">Trang Chủ</Link>
              <Link to="/about-us" className="navbar-nav-link">About Us</Link>
              <Link to="/organizer" className="navbar-nav-link">Dashboard</Link>
            </div>

          </div>

          {/* ================= DESKTOP ================= */}
          <div className="hidden lg:flex justify-between items-center w-full">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/src/assets/images/Logo VeriTix.png"
                className="navbar-logo-img"
                alt="logo"
              />
              <span className="navbar-brand-text">VeriTix</span>
            </Link>

            {/* Center */}
            <div className="flex items-center gap-8">

              {/* Search */}
              <div className="navbar-search">
                <input
                  type="text"
                  className="navbar-search-input"
                  placeholder="Tìm sự kiện..."
                />
              </div>

              {/* Links */}
              <div className="flex items-center gap-6 whitespace-nowrap">
                <Link to="/" className="navbar-nav-link">Trang Chủ</Link>
                <Link to="/about-us" className="navbar-nav-link">About Us</Link>

                {walletAddress && (
                  <Link to="/user/my-tickets" className="navbar-nav-link">
                    Vé Của Tôi
                  </Link>
                )}

                <Link to="/organizer" className="navbar-nav-link">
                  Dashboard
                </Link>
              </div>

            </div>

            {/* Right */}
            <div className="flex items-center gap-3">

              {!walletAddress ? (
                <button 
                  onClick={connectWallet} 
                  className="navbar-btn-wallet whitespace-nowrap"
                >
                  Kết Nối Ví
                </button>
              ) : (
                <div className="navbar-wallet-badge whitespace-nowrap">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
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

        </div>
      </nav>

      {/* Padding fix cho navbar cao hơn trên mobile */}
      <main className="pt-28 lg:pt-24">
        {children}
      </main>
    </div>
  );
};

export default Navbar;