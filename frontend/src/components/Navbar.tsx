import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleConnectWallet = () => {
    console.log('Connect Wallet clicked');
    // TODO: Implement wallet connection logic
  };

  return (
    <div>
      <nav className="py-4 fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-[10px] shadow-2xl z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center gap-8">
            <div className="flex items-center gap-3 whitespace-nowrap flex-shrink-0">
              <img
                src="/src/assets/images/Logo VeriTix.png"
                alt="VeriTix Logo"
                className="w-8 h-8 object-contain"
              />
              <div className="text-2xl font-bold bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent letter-[-0.025em] whitespace-nowrap">VeriTix</div>
            </div>
            <div className={`flex items-center gap-5 flex-wrap ${mobileMenuOpen ? 'flex-col absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-[10px] p-4' : ''}`}>
              <div className="w-full max-w-[400px] min-w-[280px]">
                <input
                  type="text"
                  className="w-full py-2.5 px-4 rounded-full border-none bg-slate-800 text-white placeholder-gray-400"
                  placeholder="Tìm kiếm sự kiện, nghệ sĩ, địa điểm..."
                />
              </div>
              <Link to="/" className="inline-flex items-center justify-center text-white no-underline gap-1.5 hover:text-cyan-400 transition-colors">
                Trang Chủ
              </Link>
              <Link to="/" className="inline-flex items-center justify-center text-white no-underline gap-1.5 hover:text-cyan-400 transition-colors">
                Sự Kiện
              </Link>
              <Link to="/" className="inline-flex items-center justify-center text-white no-underline gap-1.5 hover:text-cyan-400 transition-colors">
                Vé Của Tôi
              </Link>
              <button 
                className="inline-flex items-center justify-center text-white no-underline gap-1.5 hover:text-cyan-400 transition-colors bg-none border-none p-0 cursor-pointer"
                onClick={handleConnectWallet}
              >
                Connect Wallet
              </button>
              <a href="#" className="border border-cyan-400 bg-transparent text-cyan-400 py-2 px-4 rounded-full hover:bg-cyan-400 hover:text-white transition-colors">
                Bắt Đầu
              </a>
            </div>
            {isMobile && (
              <button 
                className="flex flex-col gap-1 p-2 bg-none border-none cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className="w-6 h-0.5 bg-white"></span>
                <span className="w-6 h-0.5 bg-white"></span>
                <span className="w-6 h-0.5 bg-white"></span>
              </button>
            )}
          </div>
        </div>
      </nav>
      <main className="pt-26">
        {children}
      </main>
    </div>
  );
};

export default Navbar;