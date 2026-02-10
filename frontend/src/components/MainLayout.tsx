import React, { type ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../assets/styles/layout.css';
import logo from "../assets/images/Logo VeriTix.png";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Lỗi parse user:", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  
  const getFirstName = (fullName: string) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    return parts[parts.length - 1]; 
  };

  return (
    <div className="layout-wrapper">
      <header className="layout-header">
  <div className="container header-content">

    <Link to="/" className="logo-container">
  <img src={logo} alt="VeriTix Logo" className="logo-image" />
  <span className="logo-text">VeriTix</span>
  
</Link>

    <div className="search-bar">
              <input type="text" className="search-input" placeholder="Tìm kiếm sự kiện, nghệ sĩ, địa điểm..." />
              <button className="search-btn">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

    {/* Navigation */}
    <nav className="nav-links">
      <Link to="/events" className="nav-link">Sự kiện</Link>
      <Link to="/create-event" className="nav-link">Tổ chức</Link>
      {user && <Link to="/my-tickets" className="nav-link">Vé của tôi</Link>}
      <Link to="/trading" className="nav-link">Giao dịch</Link>
    </nav>

    {/* Actions */}
    <div className="header-actions">
      {user ? (
        <div className="user-profile-menu">

          <div className="user-avatar">
            {getFirstName(user.fullName).charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <span className="user-name">
              Xin chào, {getFirstName(user.fullName)}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Đăng xuất
            </button>
          </div>

        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-outline">
            Đăng nhập
          </Link>
          <Link to="/register" className="btn btn-primary">
            Đăng ký
          </Link>
        </div>
      )}
    </div>

  </div>
</header>

      <main className="layout-main container">{children}</main>

      <footer className="layout-footer">
        <div className="container">
          <p>&copy; 2026 VeriTix. Nền tảng vé NFT minh bạch.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;