import React, { createContext, useContext, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { EVENT_DETAIL_NAV } from '../../constants/sidebar';

/* ══════════════════════════════════════════
   EventDetailSidebar — Sidebar cấp 2
   Redesigned theo tông màu OrganizerSidebar:
   - bg #111827, border sky-400/12
   - Active: sky-400 / sky-400/10
   - Collapsible + tooltip khi thu gọn
   - Group headings ẩn khi collapsed
   ══════════════════════════════════════════ */

/* ── SVG Icons ── */
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

/* ── Icon mapping cho từng nav item ── */
const NAV_ICONS: Record<string, React.ReactNode> = {
  summary: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
    </svg>
  ),
  checkin: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  members: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  edit: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  vouchers: (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
      <path d="M2 8h20v4H2z" />
      <path d="M12 2v6" />
      <circle cx="12" cy="14" r="2" />
    </svg>
  ),
};

/* ── Group icon mapping ── */
const GROUP_ICONS: Record<string, React.ReactNode> = {
  'Báo cáo': (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  'Cài đặt sự kiện': (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  Marketing: (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
};

/* ── Context ── */
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

/* ── NavItem với tooltip khi collapsed ── */
const SidebarItem: React.FC<{ icon: React.ReactNode; text: string; to: string }> = ({
  icon,
  text,
  to,
}) => {
  const { expanded } = useContext(SidebarContext);
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={({ isActive }) => `
        relative flex items-center rounded-lg text-[13.5px] font-medium
        no-underline whitespace-nowrap transition-all duration-200
        ${expanded ? 'gap-2.5 px-3 py-2.5' : 'justify-center px-0 py-2.5'}
        ${
          isActive
            ? 'text-sky-400 bg-sky-400/10'
            : 'text-slate-400 hover:text-slate-100 hover:bg-[#1a2235]'
        }
      `}
    >
      <span className="shrink-0 w-5 flex items-center justify-center opacity-80">{icon}</span>

      <span
        className="overflow-hidden transition-all duration-300"
        style={{ width: expanded ? 150 : 0, opacity: expanded ? 1 : 0 }}
      >
        {text}
      </span>

      {/* Tooltip khi collapsed */}
      {!expanded && hovered && (
        <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 z-[200] bg-[#1e293b] text-slate-100 px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap pointer-events-none border border-sky-400/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-[vtx-tooltip-in_0.15s_ease-out]">
          {text}
          <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-[#1e293b] border-l border-b border-sky-400/[0.18]" />
        </div>
      )}
    </NavLink>
  );
};

/* ── Group Heading — ẩn khi collapsed ── */
const GroupHeading: React.FC<{ label: string; icon: React.ReactNode }> = ({ label, icon }) => {
  const { expanded } = useContext(SidebarContext);
  return (
    <div
      className={`flex items-center gap-1.5 pt-4 pb-1 transition-all duration-300 ${
        expanded
          ? 'px-3 opacity-100'
          : 'justify-center px-0 opacity-0 h-0 pt-2 pb-0 overflow-hidden'
      }`}
    >
      <span className="text-slate-600">{icon}</span>
      <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-600 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};

/* ── Back button tách ra để dùng SidebarContext ── */
const BackButton: React.FC<{ expanded: boolean; onClick: () => void }> = ({
  expanded,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative flex items-center rounded-lg text-[13px] font-semibold
        text-slate-400 hover:text-slate-100 hover:bg-[#1a2235]
        transition-all duration-200 cursor-pointer w-full
        ${expanded ? 'gap-2.5 px-3 py-2.5' : 'justify-center px-0 py-2.5'}
      `}
    >
      <span className="shrink-0 w-5 flex items-center justify-center">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </span>
      <span
        className="overflow-hidden transition-all duration-300 whitespace-nowrap"
        style={{ width: expanded ? 150 : 0, opacity: expanded ? 1 : 0 }}
      >
        Quản trị sự kiện
      </span>
      {!expanded && hovered && (
        <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 z-[200] bg-[#1e293b] text-slate-100 px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap pointer-events-none border border-sky-400/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          Quản trị sự kiện
          <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-[#1e293b] border-l border-b border-sky-400/[0.18]" />
        </div>
      )}
    </button>
  );
};

/* ══════════════════════════════════════════
   EventDetailSidebar
   ══════════════════════════════════════════ */
type EventDetailSidebarProps = {
  eventId: string;
  eventName?: string;
  expanded: boolean;
  onToggle: () => void;
};

const EventDetailSidebar: React.FC<EventDetailSidebarProps> = ({
  eventId,
  eventName,
  expanded,
  onToggle,
}) => {
  const navigate = useNavigate();
  const { eventId: paramId } = useParams();
  const basePath = `/organizer/events/${eventId || paramId}`;

  return (
    <aside
      className="
        fixed top-0 left-0 bottom-0 z-50
        bg-[#111827] border-r border-sky-400/[0.12]
        flex flex-col py-6
        transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        overflow-hidden
      "
      style={{ width: expanded ? 220 : 68 }}
    >
      {/* ── Event Name Header + Toggle ── */}
      <div
        className={`border-b border-sky-400/[0.12] flex items-center min-h-[44px] ${expanded ? 'px-5 pb-5 justify-between gap-2' : 'pb-5 justify-center'}`}
      >
        {/* Event name — ẩn khi collapsed */}
        <div
          className="overflow-hidden transition-all duration-300 min-w-0"
          style={{ width: expanded ? 148 : 0, opacity: expanded ? 1 : 0 }}
        >
          <p className="text-[11px] text-slate-500 tracking-[0.06em] uppercase font-medium mb-0.5">
            Sự kiện
          </p>
          <p className="text-[14px] font-bold text-sky-400 leading-snug line-clamp-2 whitespace-normal">
            {eventName ?? '—'}
          </p>
        </div>
        <button
          onClick={onToggle}
          className="bg-sky-400/[0.08] border border-sky-400/[0.15] rounded-lg p-1.5 text-slate-400 cursor-pointer shrink-0 flex items-center justify-center transition-colors duration-150 hover:text-slate-200 hover:bg-sky-400/[0.14]"
        >
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <SidebarContext.Provider value={{ expanded }}>
        <nav
          className={`flex-1 flex flex-col gap-1 pt-4 overflow-y-auto overflow-x-hidden ${expanded ? 'px-3' : 'px-2.5'}`}
        >
          {/* ── Back button ── */}
          <BackButton expanded={expanded} onClick={() => navigate('/organizer/events')} />

          <div className="mx-0 my-2 border-t border-sky-400/[0.08]" />

          {/* ── Grouped nav items ── */}
          {EVENT_DETAIL_NAV.map((group, groupIdx) => (
            <div key={group.group} className={`flex flex-col gap-1 ${groupIdx > 0 ? 'mt-1' : ''}`}>
              <GroupHeading label={group.group} icon={GROUP_ICONS[group.group]} />
              {group.items.map((item) => (
                <SidebarItem
                  key={item.key}
                  icon={
                    NAV_ICONS[item.key] ?? (
                      <span className="w-[15px] h-[15px] block rounded bg-slate-700/50" />
                    )
                  }
                  text={item.label}
                  to={`${basePath}/${item.path}`}
                />
              ))}
            </div>
          ))}
        </nav>
      </SidebarContext.Provider>

      {/* ── Footer: Blockchain Badge ── */}
      <div
        className={`border-t border-sky-400/[0.12] pt-4 flex items-center gap-2 ${expanded ? 'px-5' : 'justify-center'}`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-slate-600 shrink-0"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span
          className="overflow-hidden transition-all duration-300 text-[10px] tracking-[0.08em] uppercase text-slate-600 whitespace-nowrap"
          style={{ width: expanded ? 140 : 0, opacity: expanded ? 1 : 0 }}
        >
          On-chain verified
        </span>
      </div>
    </aside>
  );
};

export default EventDetailSidebar;
