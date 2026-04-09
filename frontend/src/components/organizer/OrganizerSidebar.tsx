import React from 'react';

/* ══════════════════════════════════════════
   OrganizerSidebar — Navigation sidebar
   ══════════════════════════════════════════ */

type NavItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: 'events',
    label: 'Sự kiện của tôi',
    icon: <span className="text-[15px] opacity-80">◈</span>,
    active: true,
  },
  {
    key: 'reports',
    label: 'Quản lý báo cáo',
    icon: <span className="text-[15px] opacity-80">⊞</span>,
  },
  {
    key: 'terms',
    label: 'Điều khoản',
    icon: <span className="text-[15px] opacity-80">≡</span>,
  },
];

const OrganizerSidebar: React.FC = () => {
  return (
    <aside
      className={`
        fixed top-0 left-0 bottom-0 z-50
        hidden lg:flex flex-col
        w-[220px] overflow-y-auto shrink-0
        bg-[#111827] border-r border-[rgba(99,179,237,0.12)]
        py-[24px]
      `}
    >
      {/* Logo */}
      <div className="px-[20px] pb-[24px] border-b border-[rgba(99,179,237,0.12)]">
        <span className="text-[15px] font-bold tracking-[0.04em] text-[#38bdf8]">Veritix</span>
        <p className="text-[11px] text-[#94a3b8] mt-[2px] uppercase tracking-[0.06em]">
          Organizer Center
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-[12px] py-[16px] flex flex-col gap-[4px]">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.key}
            href="#"
            className={`
              flex items-center gap-[10px] px-[12px] py-[9px]
              rounded-[8px] text-[13.5px] font-medium
              transition-colors duration-150 cursor-pointer
              no-underline
              ${
                item.active
                  ? 'bg-[rgba(56,189,248,0.1)] text-[#38bdf8]'
                  : 'text-[#94a3b8] hover:bg-[#1a2235] hover:text-[#f1f5f9]'
              }
            `}
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </nav>

      {/* Footer — user info */}
      <div className="px-[20px] pt-[16px] border-t border-[rgba(99,179,237,0.12)] flex items-center gap-[10px]">
        <div
          className={`
            w-[34px] h-[34px] rounded-[8px]
            bg-[rgba(56,189,248,0.15)]
            flex items-center justify-center
            text-[#38bdf8] text-[13px] font-bold shrink-0
          `}
        >
          OR
        </div>
        <div className="overflow-hidden">
          <p className="text-[13px] font-semibold text-[#f1f5f9] truncate">Organizer</p>
          <p className="text-[11px] text-[#94a3b8] truncate">dashboard@veritix.io</p>
        </div>
      </div>
    </aside>
  );
};

export default OrganizerSidebar;
