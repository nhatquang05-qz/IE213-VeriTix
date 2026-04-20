import { useState } from "react";
import type { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ children }: PropsWithChildren) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass =
    "inline-flex h-11 items-center justify-center px-1 text-base font-semibold leading-none text-slate-100 transition-colors duration-200 hover:text-cyan-200";

  const mobileNavLinkClass =
    "text-sm font-medium text-slate-200/90 hover:text-white transition-colors duration-200";

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-cyan-300/10 bg-gradient-to-r from-[#021126] via-[#07172e] to-[#031328] px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto grid h-20 w-full max-w-[1760px] grid-cols-[auto_1fr_auto] items-center gap-6">
        <Link to="/" className="group ml-1 flex h-11 shrink-0 items-center gap-3 self-center sm:ml-0">
          <img
            src="/src/assets/images/Logo VeriTix.png"
            alt="VeriTix logo"
            className="h-10 w-10 object-contain"
          />
          <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-3xl font-semibold leading-none text-transparent">
            VeriTix
          </span>
        </Link>

        <div className="relative hidden w-full max-w-[560px] justify-self-center self-center xl:block">
          <input
            type="text"
            placeholder=" Tìm sự kiện, nghệ sĩ, địa điểm..."
            className="h-12 w-full rounded-2xl border border-cyan-300/45 bg-[#243345] pl-6 pr-14 text-base text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70"
          />
          <button
            type="button"
            aria-label="Tìm kiếm"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#0ea5e9] text-white transition hover:brightness-110"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="hidden h-11 items-center gap-8 justify-self-end self-center xl:flex">
          <Link to="/" className={navLinkClass}>
            Trang Chủ
          </Link>
          <Link to="/events" className={navLinkClass}>
            Sự Kiện
          </Link>
          <Link to="/user/my-tickets" className={navLinkClass}>
            Vé Của Tôi
          </Link>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center px-1 text-sm font-semibold leading-none text-slate-100 transition-colors duration-200 hover:text-cyan-200"
          >
            Connect Wallet
          </button>
          <button
            type="button"
            className="inline-flex h-11 min-w-[170px] items-center justify-center rounded-2xl border border-cyan-200/70 bg-[#0ea5e9] px-12 text-base font-semibold leading-none text-white shadow-[0_8px_24px_rgba(14,165,233,0.35)] transition hover:brightness-110"
          >
            Bắt Đầu
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="mr-1 inline-flex h-10 w-10 items-center justify-center justify-self-end self-center rounded-lg border border-white/15 text-slate-200 transition hover:border-cyan-300/50 hover:text-white sm:mr-0 xl:hidden"
        >
          {isMenuOpen ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-white/10 bg-slate-950/95 px-2 pb-5 pt-4 sm:px-3 lg:hidden">
            <div className="mx-auto w-full max-w-[1760px] px-0 sm:px-2">
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm sự kiện, nghệ sĩ, địa điểm..."
                    className="h-11 w-full rounded-full border border-white/10 bg-slate-900/70 pl-4 pr-11 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                  />
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link to="/" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>
                  Trang chủ
                </Link>
                <Link to="/events" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>
                  Sự kiện
                </Link>
                <Link to="/user/my-tickets" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>
                  Vé của tôi
                </Link>
                <button
                  type="button"
                  className="mt-1 rounded-full border border-cyan-300/35 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:border-cyan-200/70 hover:bg-cyan-300/10"
                >
                  Connect Wallet
                </button>
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 px-5 py-2 text-sm font-semibold text-slate-950 shadow-[0_8px_24px_rgba(56,189,248,0.35)] transition hover:brightness-110"
                >
                  Bắt đầu
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-20">{children}</main>
    </>
  );
};

export default Navbar;