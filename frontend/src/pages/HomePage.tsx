// test123
import React from 'react';
import skyTourImg from '../assets/images/Sky_Tour.jpg';
import TuPhuImg from '../assets/images/Tứ Phủ Concert.jpg';
import RapVietImg from '../assets/images/Rap_Viet.jpg';
import VLeagueImg from '../assets/images/V_League.webp';
import VBAImg from '../assets/images/VBA.jpg';
import MarathonImg from '../assets/images/Marathon.jpg';
import TTHVTCXImg from '../assets/images/TTHVTCX.jpg';
import TrienLamImg from '../assets/images/TrienLam.jpg';
import StandUpImg from '../assets/images/StandUp.png';
import '../assets/styles/HomePage.css';
import { useBlockchainAnimation } from '../hooks/useBlockchainAnimation';

const HomePage: React.FC = () => {
  // Khởi tạo animation blockchain
  useBlockchainAnimation();

  return (
    <div className="homepage">

      {/* Hero Section */}
      <section className="hero">
        <canvas className="blockchain-bg" id="blockchainCanvas"></canvas>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Bán Vé Bảo Mật<br/>Trên Blockchain</h1>
            <p className="hero-subtitle">Trải nghiệm tương lai của vé sự kiện với xác thực blockchain và thanh toán số liền mạch</p>
            
            <div className="hero-ticket">
              <div className="ticket-glow"></div>
              <div className="ticket-content">
                <div className="ticket-info">
                  <h3>Truy Cập Sự Kiện Đã Xác Thực</h3>
                  <p className="ticket-desc">Mỗi vé được bảo vệ bởi công nghệ blockchain, đảm bảo tính xác thực và không thể làm giả. Trải nghiệm an toàn tuyệt đối cho mọi sự kiện.</p>
                </div>
                <div className="blockchain-icon">
                  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2"/>
                    <circle cx="60" cy="60" r="35" fill="none" stroke="rgba(0, 212, 255, 0.5)" strokeWidth="2"/>
                    <circle cx="60" cy="60" r="20" fill="rgba(0, 212, 255, 0.2)" stroke="#00d4ff" strokeWidth="3"/>
                    <circle cx="60" cy="20" r="8" fill="#00d4ff"/>
                    <circle cx="95" cy="60" r="8" fill="#00d4ff"/>
                    <circle cx="60" cy="100" r="8" fill="#00d4ff"/>
                    <circle cx="25" cy="60" r="8" fill="#00d4ff"/>
                    <line x1="60" y1="28" x2="60" y2="52" stroke="#00d4ff" strokeWidth="2"/>
                    <line x1="87" y1="60" x2="68" y2="60" stroke="#00d4ff" strokeWidth="2"/>
                    <line x1="60" y1="92" x2="60" y2="68" stroke="#00d4ff" strokeWidth="2"/>
                    <line x1="33" y1="60" x2="52" y2="60" stroke="#00d4ff" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Tại Sao Chọn VeriTix</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="icon-svg" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
              <h3>Bảo Mật Blockchain</h3>
              <p className="feature-desc">Mỗi vé được mã hóa và lưu trữ trên blockchain, đảm bảo an toàn tuyệt đối và không thể bị xâm nhập hay làm giả.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg className="icon-svg" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h3>Xác Thực Tức Thì</h3>
              <p className="feature-desc">Xác minh tính hợp lệ của vé trong vài giây với công nghệ blockchain, giúp bạn yên tâm trước mọi giao dịch.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg className="icon-svg" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <h3>Thanh Toán Crypto</h3>
              <p className="feature-desc">Hỗ trợ đa dạng phương thức thanh toán bằng tiền điện tử, mang đến sự tiện lợi và bảo mật cao nhất cho người dùng.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg className="icon-svg" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3>Không Vé Giả</h3>
              <p className="feature-desc">Công nghệ blockchain loại bỏ hoàn toàn khả năng làm giả vé, bảo vệ bạn khỏi mọi rủi ro gian lận trong giao dịch.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg className="icon-svg" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h3>Ưu Đãi Sinh Viên</h3>
              <p className="feature-desc">Chương trình giảm giá đặc biệt dành cho sinh viên và người trẻ, giúp bạn tận hưởng sự kiện yêu thích với mức giá tốt nhất.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg className="icon-svg" viewBox="0 0 24 24">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
                </svg>
              </div>
              <h3>Chuyển Nhượng Nhanh</h3>
              <p className="feature-desc">Chuyển vé cho bạn bè chỉ trong vài giây với hệ thống blockchain nhanh chóng, an toàn và minh bạch hoàn toàn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Listing Section */}
      <section className="ticket-listing">
        <div className="container">
          {/* Âm Nhạc */}
          <div className="category-section">
            <div className="category-header">
              <h2 className="category-title">Âm Nhạc & Concert</h2>
              <a href="#" className="view-more-btn">Xem Thêm →</a>
            </div>
            <div className="ticket-list">
              <div className="ticket-item">
                <div className="ticket-image">
                  <img src={skyTourImg} alt="Sky Tour" className="event-img" />
                  <div className="event-badge">HOT</div>
                </div>
                <div className="ticket-details">
                  <h3 className="ticket-title">Sơn Tùng M-TP Sky Tour 2025</h3>
                  <p className="ticket-info">
                    <span className="info-icon">📍</span> Mỹ Đình Stadium • 15/03/2025
                  </p>
                </div>
                <div className="ticket-price">
                  <div className="price-label">Giá từ</div>
                  <div className="price-value">1.200.000đ</div>
                </div>
              </div>

              <div className="ticket-item">
                <div className="ticket-image">
                  <img src={TuPhuImg} alt="Tu Phu" className="event-img" />
                </div>
                <div className="ticket-details">
                  <h3 className="ticket-title">Hoàng Thùy Linh - Tứ Phủ Concert</h3>
                  <p className="ticket-info">
                    <span className="info-icon">📍</span> Cung Văn Hóa • 22/03/2025
                  </p>
                </div>
                <div className="ticket-price">
                  <div className="price-label">Giá từ</div>
                  <div className="price-value">800.000đ</div>
                </div>
              </div>

              <div className="ticket-item">
                <div className="ticket-image">
                  <img src={RapVietImg} alt="Rap Việt" className="event-img" />
                </div>
                <div className="ticket-details">
                  <h3 className="ticket-title">Rap Việt All Stars Live Concert</h3>
                  <p className="ticket-info">
                    <span className="info-icon">📍</span> TP. Hồ Chí Minh • 01/04/2025
                  </p>
                </div>
                <div className="ticket-price">
                  <div className="price-label">Giá từ</div>
                  <div className="price-value">600.000đ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Thể Thao */}
          <div className="category-section">
            <div className="category-header">
              <h2 className="category-title">Thể Thao</h2>
              <a href="#" className="view-more-btn">Xem Thêm →</a>
            </div>
            <div className="ticket-list">
              <div className="ticket-item">
                <div className="ticket-image">
                  <img src={VLeagueImg} alt="V-League" className="event-img" />
                  <div className="event-badge">HOT</div>
                </div>
                <div className="ticket-details">
                  <h3 className="ticket-title">V-League 2025: Hà Nội FC vs HAGL</h3>
                  <p className="ticket-info">
                    <span className="info-icon">📍</span> Sân Hàng Đẫy • 10/03/2025
                  </p>
                </div>
                <div className="ticket-price">
                  <div className="price-label">Giá từ</div>
                  <div className="price-value">150.000đ</div>
                </div>
              </div>

              <div className="ticket-item">
                <div className="ticket-image">
                  <img src={VBAImg} alt="VBA" className="event-img" />
                </div>
                <div className="ticket-details">
                  <h3 className="ticket-title">Giải VBA 2025 - Chung Kết</h3>
                  <p className="ticket-info">
                    <span className="info-icon">📍</span> Nhà Thi Đấu Phú Thọ • 18/04/2025
                  </p>
                </div>
                <div className="ticket-price">
                  <div className="price-label">Giá từ</div>
                  <div className="price-value">200.000đ</div>
                </div>
              </div>

              <div className="ticket-item">
                <div className="ticket-image">
                  <img src={MarathonImg} alt="Marathon" className="event-img" />
                </div>
                <div className="ticket-details">
                  <h3 className="ticket-title">Marathon Quốc Tế TP. Hồ Chí Minh</h3>
                  <p className="ticket-info">
                    <span className="info-icon">📍</span> TP. Hồ Chí Minh • 05/05/2025
                  </p>
                </div>
                <div className="ticket-price">
                  <div className="price-label">Giá từ</div>
                  <div className="price-value">50.000đ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Nghệ Thuật & Kịch */}
          <div className="category-section">
            <div className="category-header">
              <h2 className="category-title">Nghệ Thuật & Kịch</h2>
              <a href="#" className="view-more-btn">Xem Thêm →</a>
            </div>
            <div className="ticket-list">
              <div className="ticket-item">
                <div className="ticket-image">
                  <img src={TTHVTCXImg} alt="Vở Kịch 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh'" className="event-img" />
                  <div className="event-badge">HOT</div>
                </div>
                <div className="ticket-details">
                  <h3 className="ticket-title">Vở Kịch "Tôi Thấy Hoa Vàng Trên Cỏ Xanh"</h3>
                  <p className="ticket-info">
                    <span className="info-icon">📍</span> Nhà Hát Lớn Hà Nội • 08/04/2025
                  </p>
                </div>
                <div className="ticket-price">
                  <div className="price-label">Giá từ</div>
                  <div className="price-value">300.000đ</div>
                </div>
              </div>

              <div className="ticket-item">
                <div className="ticket-image">
                  <img src={TrienLamImg} alt="Triển Lãm Nghệ Thuật Đương Đại Việt Nam" className="event-img" />
                </div>
                <div className="ticket-details">
                  <h3 className="ticket-title">Triển Lãm Nghệ Thuật Đương Đại Việt Nam</h3>
                  <p className="ticket-info">
                    <span className="info-icon">📍</span> Bảo Tàng Mỹ Thuật • 15/03/2025
                  </p>
                </div>
                <div className="ticket-price">
                  <div className="price-label">Giá từ</div>
                  <div className="price-value">80.000đ</div>
                </div>
              </div>

              <div className="ticket-item">
                <div className="ticket-image">
                  <img src={StandUpImg} alt="Stand-up Comedy - Trấn Thành Live Show" className="event-img" />
                </div>
                <div className="ticket-details">
                  <h3 className="ticket-title">Stand-up Comedy - Trấn Thành Live Show</h3>
                  <p className="ticket-info">
                    <span className="info-icon">📍</span> TP. Hồ Chí Minh • 22/04/2025
                  </p>
                </div>
                <div className="ticket-price">
                  <div className="price-label">Giá từ</div>
                  <div className="price-value">450.000đ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Trust Section */}
      <section className="blockchain-trust">
        <div className="container">
          <div className="trust-content">
            <div className="trust-text">
              <h2>Xây Dựng Trên Niềm Tin<br/>Vận Hành Bởi Blockchain</h2>
              <p className="trust-desc">VeriTix sử dụng công nghệ blockchain phi tập trung để đảm bảo mỗi giao dịch đều minh bạch, an toàn và không thể thay đổi. Hệ thống của chúng tôi loại bỏ hoàn toàn vé giả, gian lận và đảm bảo quyền lợi tối đa cho người dùng.</p>
              <p className="trust-desc">Với mạng lưới node toàn cầu, mọi vé được xác minh trong vài giây, mang đến trải nghiệm mua vé nhanh chóng và đáng tin cậy nhất.</p>
            </div>
            <div className="trust-visual">
              <div className="network-node">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="15" fill="white" opacity="0.2"/>
                  <circle cx="20" cy="20" r="8" fill="white"/>
                </svg>
              </div>
              <div className="network-node">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="15" fill="white" opacity="0.2"/>
                  <circle cx="20" cy="20" r="8" fill="white"/>
                </svg>
              </div>
              <div className="network-node">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="15" fill="white" opacity="0.2"/>
                  <circle cx="20" cy="20" r="8" fill="white"/>
                </svg>
              </div>
              <div className="network-node">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="15" fill="white" opacity="0.2"/>
                  <circle cx="20" cy="20" r="8" fill="white"/>
                </svg>
              </div>
              <div className="network-node" style={{width: '100px', height: '100px'}}>
                <svg width="50" height="50" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="white" opacity="0.2"/>
                  <circle cx="25" cy="25" r="10" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
