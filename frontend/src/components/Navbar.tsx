import React, { useState } from 'react'; 
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { connectWallet, walletAddress } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div>
      <nav className="fixed top-0 right-0 left-0 z-[1000] border-b border-cyan-400/10 bg-[rgba(7,20,38,0.9)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,102,255,0.05)_0%,rgba(0,212,255,0.02)_50%,rgba(0,102,255,0.05)_100%)]" />

        <div className="relative mx-auto flex h-[86px] w-full max-w-[1640px] items-center justify-between gap-6 px-10 max-[1024px]:h-[72px] max-[1024px]:px-6">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="relative flex h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-cyan-400/30 bg-[linear-gradient(135deg,rgba(0,102,255,0.2),rgba(0,212,255,0.1))] p-[7px]">
              <img
                src="/src/assets/images/Logo VeriTix.png"
                alt="VeriTix Logo"
                className="h-7 w-7 object-contain"
              />
            </div>
            <span className="text-2xl leading-none font-extrabold tracking-[-0.02em] text-[#1d7cff] max-[1280px]:text-[22px] max-[1024px]:text-[20px]">
              VeriTix
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-8 xl:flex">
            <div className="relative w-[420px] shrink-0">
                <input
                type="text"
                  className="w-full rounded-2xl border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] py-3 pr-5 pl-5 text-sm font-medium text-white/80 outline-none transition placeholder:text-white/45 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                placeholder="Tìm sự kiện..."
              />
            </div>

            <div className="flex items-center gap-4 whitespace-nowrap">
              <Link 
                to="/" 
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive('/') ? 'text-cyan-300' : 'text-white/80 hover:text-cyan-300'
                }`}
              >
                Trang Chủ
              </Link>
              <Link 
                to="/about-us" 
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive('/about-us') ? 'text-cyan-300' : 'text-white/80 hover:text-cyan-300'
                }`}
              >
                About Us
              </Link>
              {walletAddress && (
                <Link
                  to="/user/my-tickets"
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    isActive('/user/my-tickets') ? 'text-cyan-300' : 'text-white/80 hover:text-cyan-300'
                  }`}
                >
                  Vé Của Tôi
                </Link>
              )}
              <Link 
                to="/organizer" 
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive('/organizer') ? 'text-cyan-300' : 'text-white/80 hover:text-cyan-300'
                }`}
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="hidden items-center justify-end gap-4 xl:flex">
            {!walletAddress ? (
              <button
                onClick={connectWallet}
                  className="cursor-pointer rounded-[14px] border border-cyan-400/35 bg-[linear-gradient(135deg,rgba(0,102,255,0.15),rgba(0,212,255,0.1))] px-6 py-2.5 text-[13px] font-bold whitespace-nowrap text-white/95 transition hover:border-cyan-300 hover:text-cyan-200"
              >
                Kết Nối Ví
              </button>
            ) : (
                <div className="flex items-center gap-2 rounded-[12px] border border-emerald-500/35 bg-emerald-500/10 px-4 py-2.5 font-mono text-sm text-emerald-300">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              </div>
            )}

            <Link
              to="/organizer/events/create"
              className="inline-flex items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#1f8bff_0%,#18c7ff_100%)] px-7 py-2.5 text-[13px] font-extrabold whitespace-nowrap text-white shadow-[0_6px_24px_rgba(0,102,255,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(0,102,255,0.55)]"
            >
              Bắt Đầu
            </Link>
          </div>

          <button
            className="ml-auto flex flex-col gap-1.5 rounded-md p-2 xl:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open mobile menu"
          >
            <span className="h-0.5 w-5 rounded bg-cyan-300" />
            <span className="h-0.5 w-5 rounded bg-cyan-300" />
            <span className="h-0.5 w-5 rounded bg-cyan-300" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="relative mx-4 mb-4 flex flex-col gap-3 rounded-xl border border-cyan-400/20 bg-[rgba(7,20,38,0.98)] p-4 xl:hidden">
            <Link 
              to="/" 
              className={`rounded-lg px-3 py-2 text-sm transition ${
                isActive('/') ? 'bg-cyan-400/20 text-cyan-300' : 'text-white/85 hover:bg-cyan-400/10'
              }`}
            >
              Trang Chủ
            </Link>
            <Link 
              to="/about-us" 
              className={`rounded-lg px-3 py-2 text-sm transition ${
                isActive('/about-us') ? 'bg-cyan-400/20 text-cyan-300' : 'text-white/85 hover:bg-cyan-400/10'
              }`}
            >
              About Us
            </Link>
            {walletAddress && (
              <Link 
                to="/user/my-tickets" 
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  isActive('/user/my-tickets') ? 'bg-cyan-400/20 text-cyan-300' : 'text-white/85 hover:bg-cyan-400/10'
                }`}
              >
                Vé Của Tôi
              </Link>
            )}
            <Link 
              to="/organizer" 
              className={`rounded-lg px-3 py-2 text-sm transition ${
                isActive('/organizer') ? 'bg-cyan-400/20 text-cyan-300' : 'text-white/85 hover:bg-cyan-400/10'
              }`}
            >
              Dashboard
            </Link>
            <div className="mt-1 flex items-center gap-2">
              {!walletAddress ? (
                <button
                  onClick={connectWallet}
                  className="flex-1 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-white/90"
                >
                  Kết Nối Ví
                </button>
              ) : (
                <div className="flex-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center font-mono text-xs text-emerald-400">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              )}
              <Link
                to="/organizer/events/create"
                className="rounded-lg bg-[linear-gradient(135deg,#0066ff_0%,#00d4ff_100%)] px-3 py-2 text-xs font-bold text-white"
              >
                Bắt Đầu
              </Link>
            </div>
          </div>
        )}
      </nav>
      
      <main>
        {children}
      </main>
    </div>
  );
};

export default Navbar;