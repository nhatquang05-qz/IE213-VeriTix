import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MdConfirmationNumber } from 'react-icons/md';

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
      <nav className="py-4 fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-[10px] shadow-2xl z-[100] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center gap-4">
            
            {/* Logo - Giữ cố định bên trái */}
            <div className="flex items-center gap-3 whitespace-nowrap flex-shrink-0">
              <Link to="/" className="flex items-center gap-3 no-underline">
                <img
                  src="/src/assets/images/Logo VeriTix.png"
                  alt="VeriTix Logo"
                  className="w-8 h-8 object-contain"
                />
                <div className="text-2xl font-bold bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent letter-[-0.025em] whitespace-nowrap">
                  VeriTix
                </div>
              </Link>
            </div>

            {/* Menu Links & Actions - Dàn hàng ngang */}
            <div className={`flex items-center gap-6 ${mobileMenuOpen ? 'flex-col absolute top-full left-0 right-0 bg-slate-900/95 p-6' : 'flex-row'}`}>
              
              {/* Search Bar - Thu gọn lại một chút để lấy chỗ cho nút */}
              <div className="hidden xl:block w-[250px]">
                <input
                  type="text"
                  className="w-full py-2 px-4 rounded-full border-none bg-slate-800 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400"
                  placeholder="Tìm sự kiện..."
                />
              </div>
              
              {/* Navigation Links - Không cho xuống dòng (whitespace-nowrap) */}
              <div className="flex items-center gap-5 whitespace-nowrap">
                <Link to="/" className="text-white no-underline text-sm font-medium hover:text-cyan-400 transition-colors">
                  Trang Chủ
                </Link>
                
                {/* Chỉ hiện Vé Của Tôi khi đã có ví */}
                {walletAddress && (
                  <Link to="/user/my-tickets" className="flex items-center gap-1.5 text-white no-underline text-sm font-medium hover:text-cyan-400 transition-colors">
                    <MdConfirmationNumber className="text-cyan-400" />
                    Vé Của Tôi
                  </Link>
                )}

                <Link to="/organizer" className="text-white no-underline text-sm font-medium hover:text-cyan-400 transition-colors">
                  Dashboard
                </Link>
              </div>

              {/* Wallet & CTA Area - Group lại để cùng nằm trên một dòng */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {!walletAddress ? (
                  <button 
                    onClick={connectWallet} 
                    className="text-white text-sm font-bold bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border-none cursor-pointer transition-all"
                  >
                    Kết Nối Ví
                  </button>
                ) : (
                  <div className="flex items-center bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-emerald-400 text-xs font-mono font-bold">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                )}

                <Link to="/organizer/events/create" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold py-2 px-5 rounded-full hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all no-underline whitespace-nowrap">
                  Bắt Đầu
                </Link>
              </div>
            </div>

            {/* Mobile Toggle */}
            {isMobile && (
              <button 
                className="lg:hidden flex flex-col gap-1 p-2 bg-transparent border-none cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="w-6 h-0.5 bg-white"></span>
                <span className="w-6 h-0.5 bg-white"></span>
                <span className="w-6 h-0.5 bg-white"></span>
              </button>
            )}
          </div>
        </div>
      </nav>
      
      <main className="pt-24">
        {children}
      </main>
    </div>
  );
};

export default Navbar;