import React, { type ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../assets/styles/layout.css';

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
          <Link to="/" className="logo">
            VeriTix
          </Link>

          <nav className="nav-links">
            <Link to="/events">Sự kiện</Link>
            <Link to="/create-event">Tổ chức</Link>
            {user && <Link to="/my-tickets">Vé của tôi</Link>}
          </nav>

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
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
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