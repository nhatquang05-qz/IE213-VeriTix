import { Link } from 'react-router-dom';
import '../assets/styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="hero-section">
      <h1 className="hero-title">
        Mua vé sự kiện an toàn với <span className="text-highlight"> VeriTix</span>
      </h1>
      <p className="hero-desc">
        Giải pháp bán vé minh bạch, chống vé giả và cho phép bán lại an toàn tuyệt đối.
      </p>
      <div className="hero-actions">
        <Link to="/marketplace" className="btn btn-primary">
          Mua vé ngay
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
