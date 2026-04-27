import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ScanLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login-password`, { username, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Đăng nhập nhân viên thành công!');
      navigate('/organizer/events'); // Hoặc trang quản lý check-in
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi đăng nhập');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">HỆ THỐNG SOÁT VÉ</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            className="w-full p-3 text-black border rounded-lg"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-3 text-black border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">ĐĂNG NHẬP</button>
        </form>
      </div>
    </div>
  );
};

export default ScanLoginPage;