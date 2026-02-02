import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import '../assets/styles/auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    phone: false,
    dob: false,
    password: false,
    confirmPassword: false,
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors({ ...fieldErrors, [name]: false });
    }

    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newFieldErrors = {
      email: false,
      phone: false,
      dob: false,
      password: false,
      confirmPassword: false,
    };
    let hasError = false;

    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData]) {
        newFieldErrors[key as keyof typeof fieldErrors] = true;
        hasError = true;
      }
    });

    if (hasError) {
      setFieldErrors(newFieldErrors);
      setErrorMsg('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }

    if (formData.password.length < 8) {
      setFieldErrors({ ...newFieldErrors, password: true });
      setErrorMsg('Mật khẩu phải có tối thiểu 8 ký tự!');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setFieldErrors({ ...newFieldErrors, password: true });
      setErrorMsg('Mật khẩu phải chứa ít nhất một chữ cái IN HOA!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ ...newFieldErrors, confirmPassword: true });
      setErrorMsg('Mật khẩu nhập lại không khớp!');
      return;
    }

    console.log('Đăng ký thành công:', formData);
    alert('Đăng ký thành công! Hãy đăng nhập.');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Tạo Tài Khoản</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {}
          <div className="form-group">
            <label>
              Email <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              className={`auth-input ${fieldErrors.email ? 'error' : ''}`}
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {}
          <div className="form-group">
            <label>
              Số điện thoại <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              className={`auth-input ${fieldErrors.phone ? 'error' : ''}`}
              placeholder="0912..."
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {}
          <div className="form-group">
            <label>
              Ngày sinh <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              name="dob"
              className={`auth-input ${fieldErrors.dob ? 'error' : ''}`}
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          {}
          <div className="form-group">
            <label>
              Mật khẩu <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="password"
              name="password"
              className={`auth-input ${fieldErrors.password ? 'error' : ''}`}
              placeholder="Tối thiểu 8 ký tự và 1 chữ cái in hoa..."
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {}
          <div className="form-group">
            <label>
              Nhập lại mật khẩu <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              className={`auth-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
              placeholder="Xác nhận mật khẩu..."
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {}
          {errorMsg && <div className="login-error-msg">{errorMsg}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            Đăng Ký
          </button>

          <div className="auth-actions" style={{ justifyContent: 'center' }}>
            <span>
              Bạn đã có tài khoản?{' '}
              <Link to="/login" className="auth-link">
                Đăng nhập ngay
              </Link>
            </span>
          </div>
        </form>

        <div className="auth-divider">
          <span>hoặc đăng ký với</span>
        </div>

        <button className="social-btn google-btn">
          <FaGoogle className="social-icon" /> Sign up with Google
        </button>
        <button className="social-btn facebook-btn">
          <FaFacebook className="social-icon" /> Sign up with Facebook
        </button>

        <p className="auth-footer-text">
          Bằng việc đăng ký, bạn đồng ý với{' '}
          <Link to="/terms" className="auth-link">
            Điều khoản dịch vụ
          </Link>{' '}
          &{' '}
          <Link to="/privacy" className="auth-link">
            Chính sách bảo mật
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
