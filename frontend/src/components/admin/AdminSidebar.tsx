import React, { createContext, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md';
import { ADMIN_NAV_ITEMS } from '../../constants/sidebar';

/* ══════════════════════════════════════════
   AdminSidebar — Collapsible + Mobile Drawer
   VeriTix Admin Dashboard
   ══════════════════════════════════════════ */

/* ── Context cho expanded state ── */
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

/* ── SidebarItem (NavLink + tooltip khi thu gọn) ── */
const SidebarItem: React.FC<{
  icon: React.ElementType;
  text: string;
  to: string;
}> = ({ icon: Icon, text, to }) => {
  const { expanded } = useContext(SidebarContext);
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink
      to={to}
      end={to === '/admin/users'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={({ isActive }) => `
        relative flex items-center rounded-lg text-[13.5px] font-medium
        no-underline whitespace-nowrap transition-all duration-200
        ${expanded ? 'gap-2.5 px-3 py-2.5' : 'justify-center px-0 py-2.5'}
        ${
          isActive
            ? 'text-purple-400 bg-purple-400/10'
            : 'text-slate-400 hover:text-slate-100 hover:bg-[#1a2235]'
        }
      `}
    >
      {/* Icon */}
      <span className="opacity-80 shrink-0 w-5 flex items-center justify-center">
        <Icon size={17} />
      </span>

      {/* Label — ẩn khi collapsed */}
      <span
        className="overflow-hidden transition-all duration-300"
        style={{ width: expanded ? 150 : 0, opacity: expanded ? 1 : 0 }}
      >
        {text}
      </span>

      {/* Tooltip (collapsedmode) */}
      {!expanded && hovered && (
        <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-slate-900 text-slate-100 text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap pointer-events-none z-50 border border-slate-700 shadow-lg">
          {text}
          {/* Mũi tên trỏ sang trái */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
        </div>
      )}
    </NavLink>
  );
};

/* ── Main Sidebar ── */
type AdminSidebarProps = {
  expanded: boolean;
  onToggle: () => void;
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({ expanded, onToggle }) => {
  return (
    <SidebarContext.Provider value={{ expanded }}>
      {/* Fixed Sidebar */}
      <aside
        className="fixed left-0 top-0 h-screen bg-gradient-to-b from-[#0d0f15] to-[#070a11] border-r border-white/[0.06] flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-30"
        style={{
          width: expanded ? 220 : 68,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between h-16 px-4 border-b border-white/[0.04]"
          style={{ paddingRight: expanded ? 16 : 8 }}
        >
          {/* Logo / Title */}
          {expanded && (
            <div className="flex items-center gap-2.5 flex-1">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                VT
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">VeriTix</h2>
                <p className="text-[10px] text-slate-500">Admin</p>
              </div>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all flex-shrink-0"
          >
            {expanded ? <MdChevronLeft size={18} /> : <MdChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1.5">
          {ADMIN_NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              text={item.label}
              to={item.path}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/[0.04] p-3">
          <div
            className={`flex items-center gap-2.5 ${
              expanded ? 'px-3 py-2.5' : 'justify-center py-2.5'
            } rounded-lg bg-white/[0.04] text-[13px] text-slate-400 cursor-help transition-all duration-300`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            {expanded && <span>Phiên bản 1.0</span>}
          </div>
        </div>
      </aside>
    </SidebarContext.Provider>
  );
};

/* ── Mobile Drawer ── */
type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ open, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 h-screen w-[220px] bg-gradient-to-b from-[#0d0f15] to-[#070a11] border-r border-white/[0.06] z-20 md:hidden transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContext.Provider value={{ expanded: true }}>
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.04]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                VT
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">VeriTix</h2>
                <p className="text-[10px] text-slate-500">Admin</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all"
            >
              <MdClose size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="overflow-y-auto px-3 py-4 flex flex-col gap-1.5">
            {ADMIN_NAV_ITEMS.map((item) => (
              <SidebarItem
                key={item.key}
                icon={item.icon}
                text={item.label}
                to={item.path}
              />
            ))}
          </nav>
        </SidebarContext.Provider>
      </div>
    </>
  );
};

export default AdminSidebar;
