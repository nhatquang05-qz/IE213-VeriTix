import React from 'react';
import "../assets/styles/Homepage.css";

const Navbar = ({ children }: { children: React.ReactNode }) => {
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
            <div className="nav-links">
              <a href="#" className="nav-link">
                Trang Chủ
              </a>
              <a href="#" className="nav-link">
                Sự Kiện
              </a>
              <a href="#" className="nav-link">
                Vé Của Tôi
              </a>
              <a href="#" className="nav-cta">
                Bắt Đầu
              </a>
            </div>
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