import React, { createContext, useContext, useState } from 'react';

/* ══════════════════════════════════════════
   OrganizerSidebar — Collapsible + Responsive
   ══════════════════════════════════════════ */

type NavItem = {
  key: string;
  label: string;
  icon: string;
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'events', label: 'Sự kiện của tôi', icon: '◈', active: true },
  { key: 'reports', label: 'Quản lý báo cáo', icon: '⊞' },
  { key: 'terms', label: 'Điều khoản', icon: '≡' },
];

/* ── Icons ── */
const ChevronLeft = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const XIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Context cho expanded state ── */
export const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

/* ── SidebarItem (tooltip khi thu gọn) ── */
const SidebarItem: React.FC<{ icon: string; text: string; active?: boolean }> = ({
  icon,
  text,
  active,
}) => {
  const { expanded } = useContext(SidebarContext);
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative flex items-center rounded-[8px] text-[13.5px] font-medium
        no-underline whitespace-nowrap
        transition-all duration-200 ease-out
        ${expanded ? 'gap-[10px] px-[12px] py-[9px] justify-start' : 'gap-0 px-0 py-[9px] justify-center'}
        ${
          active
            ? 'bg-[rgba(56,189,248,0.1)] text-[#38bdf8]'
            : hovered
              ? 'bg-[#1a2235] text-[#f1f5f9]'
              : 'text-[#94a3b8]'
        }
      `}
    >
      <span className="text-[15px] opacity-80 shrink-0 w-[20px] text-center">{icon}</span>
      <span
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ width: expanded ? 150 : 0, opacity: expanded ? 1 : 0 }}
      >
        {text}
      </span>

      {/* Tooltip khi collapsed */}
      {!expanded && hovered && (
        <div
          className={`
          absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2
          bg-[#1e293b] text-[#f1f5f9] px-[14px] py-[6px] rounded-[8px]
          text-[12.5px] font-medium
          border border-[rgba(99,179,237,0.18)]
          shadow-[0_8px_32px_rgba(0,0,0,0.5)]
          z-[200] whitespace-nowrap pointer-events-none
          animate-[vtx-tooltip-in_0.15s_ease-out]
        `}
        >
          {text}
          <div
            className={`
            absolute left-[-5px] top-1/2 -translate-y-1/2 rotate-45
            w-[10px] h-[10px] bg-[#1e293b]
            border-l border-b border-[rgba(99,179,237,0.18)]
          `}
          />
        </div>
      )}
    </a>
  );
};

/* ══════════════════════════════════════════
   Desktop Sidebar (collapsible)
   ══════════════════════════════════════════ */
type OrganizerSidebarProps = {
  expanded: boolean;
  onToggle: () => void;
};

const OrganizerSidebar: React.FC<OrganizerSidebarProps> = ({ expanded, onToggle }) => {
  return (
    <aside
      className="fixed top-0 left-0 bottom-0 z-50 hidden md:flex flex-col bg-[#111827] border-r border-[rgba(99,179,237,0.12)] py-[24px] overflow-hidden"
      style={{
        width: expanded ? 220 : 68,
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Logo + Toggle */}
      <div
        className={`border-b border-[rgba(99,179,237,0.12)] flex items-center min-h-[44px] gap-[8px] ${expanded ? 'px-[20px] pb-[20px] justify-between' : 'px-0 pb-[20px] justify-center'}`}
      >
        <div
          className="overflow-hidden whitespace-nowrap"
          style={{
            width: expanded ? 120 : 0,
            opacity: expanded ? 1 : 0,
            transition: 'width 0.3s ease, opacity 0.25s ease',
          }}
        >
          <span className="text-[15px] font-bold tracking-[0.04em] text-[#38bdf8]">Veritix</span>
          <p className="text-[11px] text-[#94a3b8] mt-[2px] uppercase tracking-[0.06em]">
            Organizer Center
          </p>
        </div>
        <button
          onClick={onToggle}
          className="bg-[rgba(56,189,248,0.08)] border border-[rgba(99,179,237,0.15)] rounded-[8px] p-[6px] text-[#94a3b8] cursor-pointer flex items-center justify-center shrink-0 transition-colors duration-150 hover:text-[#38bdf8] hover:bg-[rgba(56,189,248,0.15)]"
        >
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Nav */}
      <SidebarContext.Provider value={{ expanded }}>
        <nav
          className={`flex-1 flex flex-col gap-[4px] ${expanded ? 'px-[12px] py-[16px]' : 'px-[10px] py-[16px]'}`}
        >
          {NAV_ITEMS.map((item) => (
            <SidebarItem key={item.key} icon={item.icon} text={item.label} active={item.active} />
          ))}
        </nav>
      </SidebarContext.Provider>

      {/* Footer */}
      <div
        className={`border-t border-[rgba(99,179,237,0.12)] flex items-center gap-[10px] ${expanded ? 'px-[20px] pt-[16px] justify-start' : 'px-0 pt-[16px] justify-center'}`}
      >
        <div className="w-[34px] h-[34px] rounded-[8px] bg-[rgba(56,189,248,0.15)] flex items-center justify-center text-[#38bdf8] text-[13px] font-bold shrink-0">
          OR
        </div>
        <div
          className="overflow-hidden whitespace-nowrap"
          style={{
            width: expanded ? 140 : 0,
            opacity: expanded ? 1 : 0,
            transition: 'width 0.3s ease, opacity 0.25s ease',
          }}
        >
          <p className="text-[13px] font-semibold text-[#f1f5f9] truncate">Organizer</p>
          <p className="text-[11px] text-[#94a3b8] truncate">dashboard@veritix.io</p>
        </div>
      </div>
    </aside>
  );
};

/* ══════════════════════════════════════════
   Mobile Sidebar Drawer
   ══════════════════════════════════════════ */
type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ open, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-[4px] transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
      />
      {/* Drawer */}
      <aside
        className="fixed top-0 left-0 bottom-0 z-[100] w-[270px] bg-[#111827] border-r border-[rgba(99,179,237,0.12)] flex flex-col py-[24px] transition-transform duration-300"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: open ? '8px 0 40px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        {/* Header */}
        <div className="px-[20px] pb-[20px] border-b border-[rgba(99,179,237,0.12)] flex items-center justify-between">
          <div>
            <span className="text-[15px] font-bold tracking-[0.04em] text-[#38bdf8]">Veritix</span>
            <p className="text-[11px] text-[#94a3b8] mt-[2px] uppercase tracking-[0.06em]">
              Organizer Center
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-[rgba(56,189,248,0.08)] border border-[rgba(99,179,237,0.15)] rounded-[8px] p-[6px] text-[#94a3b8] cursor-pointer flex items-center justify-center hover:text-[#38bdf8]"
          >
            <XIcon />
          </button>
        </div>
        {/* Nav */}
        <nav className="flex-1 px-[12px] py-[16px] flex flex-col gap-[4px]">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              href="#"
              onClick={onClose}
              className={`
                flex items-center gap-[10px] px-[14px] py-[11px]
                rounded-[8px] text-[14px] font-medium no-underline
                transition-colors duration-150
                ${item.active ? 'bg-[rgba(56,189,248,0.1)] text-[#38bdf8]' : 'text-[#94a3b8]'}
              `}
            >
              <span className="text-[16px] opacity-80">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        {/* Footer */}
        <div className="px-[20px] pt-[16px] border-t border-[rgba(99,179,237,0.12)] flex items-center gap-[10px]">
          <div className="w-[34px] h-[34px] rounded-[8px] bg-[rgba(56,189,248,0.15)] flex items-center justify-center text-[#38bdf8] text-[13px] font-bold shrink-0">
            OR
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#f1f5f9]">Organizer</p>
            <p className="text-[11px] text-[#94a3b8]">dashboard@veritix.io</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default OrganizerSidebar;
