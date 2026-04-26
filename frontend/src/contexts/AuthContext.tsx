import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { authService } from '../services/auth.service';
import type { User } from '../types/user.type';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // Kiểm tra token cũ khi load trang
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, [token]);

  const login = async () => {
    try {
      setLoading(true);
      if (!window.ethereum) {
        alert("Vui lòng cài đặt MetaMask!");
        return;
      }

      // 1. Kết nối ví
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const walletAddress = accounts[0];

      // 2. Lấy Nonce từ Backend
      const nonce = await authService.getNonce(walletAddress);

      // 3. Yêu cầu người dùng ký thông điệp
      const signer = await provider.getSigner();
      const message = `Chào mừng đến với VeriTix!\n\nKý tin nhắn này để xác nhận bạn là chủ sở hữu ví.\n\nMã bảo mật (Nonce): ${nonce}`;
      const signature = await signer.signMessage(message);

      // 4. Xác thực chữ ký với Backend
      const data = await authService.verifySignature(walletAddress, signature);

      // 5. Lưu thông tin
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      alert("Đăng nhập thành công!");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};