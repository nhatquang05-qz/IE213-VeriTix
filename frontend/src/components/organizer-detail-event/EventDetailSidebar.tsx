import React, { createContext, useContext, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 
import {
  MdChevronLeft,
  MdChevronRight,
  MdArrowBack,
  MdBarChart,
  MdCheckCircle,
  MdGroup,
  MdEdit,
  MdLocalOffer,
  MdInsertChart,
  MdSettings,
  MdCampaign,
} from 'react-icons/md';
import { TbCube3dSphere } from 'react-icons/tb';
import { EVENT_DETAIL_NAV } from '../../constants/sidebar';

const NAV_ICONS: Record<string, React.ReactNode> = {
  summary: <MdBarChart size={15} />,
  checkin: <MdCheckCircle size={15} />,
  members: <MdGroup size={15} />,
  edit: <MdEdit size={15} />,
  vouchers: <MdLocalOffer size={15} />,
};

const GROUP_ICONS: Record<string, React.ReactNode> = {
  'Báo cáo': <MdInsertChart size={12} />,
  'Cài đặt sự kiện': <MdSettings size={12} />,
  Marketing: <MdCampaign size={12} />,
};

const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

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
      {!expanded && hovered && (
        <div className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 z-[200] bg-[#1e293b] text-slate-100 px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium whitespace-nowrap pointer-events-none border border-sky-400/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-[vtx-tooltip-in_0.15s_ease-out]">
          {text}
          <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-[#1e293b] border-l border-b border-sky-400/[0.18]" />
        </div>
      )}
    </NavLink>
  );
};

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
        <MdArrowBack size={15} />
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

type EventDetailSidebarProps = {
  eventId: string;
  eventName?: string;
  expanded: boolean;
  onToggle: () => void;
  organizerWallet?: string; 
};

const EventDetailSidebar: React.FC<EventDetailSidebarProps> = ({
  eventId,
  eventName,
  expanded,
  onToggle,
  organizerWallet, 
}) => {
  const navigate = useNavigate();
  const { eventId: paramId } = useParams();
  const basePath = `/organizer/events/${eventId || paramId}`;
  
  const { user } = useAuth(); 

  
  const isEventOrganizer = user?.walletAddress && organizerWallet && user.walletAddress.toLowerCase() === organizerWallet.toLowerCase();
  const isStaffOnly = !isEventOrganizer;

  
  const filteredNav = EVENT_DETAIL_NAV.map(group => {
    return {
      ...group,
      items: group.items.filter(item => {
        if (isStaffOnly) {
          return item.key === 'summary' || item.key === 'checkin';
        }
        return true;
      })
    };
  }).filter(group => group.items.length > 0);

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
      <div
        className={`border-b border-sky-400/[0.12] flex items-center min-h-[44px] ${
          expanded ? 'px-5 pb-5 justify-between gap-2' : 'pb-5 justify-center'
        }`}
      >
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
          {expanded ? <MdChevronLeft size={18} /> : <MdChevronRight size={18} />}
        </button>
      </div>

      <SidebarContext.Provider value={{ expanded }}>
        <nav
          className={`!static !inset-auto !z-auto !bg-transparent !backdrop-blur-none !shadow-none !p-0 flex-1 flex flex-col gap-1 pt-4 overflow-y-auto overflow-x-hidden ${
            expanded ? 'px-3' : 'px-2.5'
          }`}
        >
          <BackButton expanded={expanded} onClick={() => navigate('/organizer/events')} />

          <div className="mx-0 my-2 border-t border-sky-400/[0.08]" />

          {}
          {filteredNav.map((group, groupIdx) => (
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

      <div
        className={`border-t border-sky-400/[0.12] pt-4 flex items-center gap-2 ${
          expanded ? 'px-5' : 'justify-center'
        }`}
      >
        <TbCube3dSphere className="text-slate-600 shrink-0" size={13} />
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

/* ══════════════════════════════════════════
   MobileEventDetailSidebar — Drawer overlay cho mobile
   ══════════════════════════════════════════ */
type MobileEventDetailSidebarProps = {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventName?: string;
  organizerWallet?: string; 
};

export const MobileEventDetailSidebar: React.FC<MobileEventDetailSidebarProps> = ({
  open,
  onClose,
  eventId,
  eventName,
  organizerWallet, 
}) => {
  const navigate = useNavigate();
  const { eventId: paramId } = useParams();
  const basePath = `/organizer/events/${eventId || paramId}`;

  const { user } = useAuth(); 

  
  const isEventOrganizer = user?.walletAddress && organizerWallet && user.walletAddress.toLowerCase() === organizerWallet.toLowerCase();
  const isStaffOnly = !isEventOrganizer;

  
  const filteredNav = EVENT_DETAIL_NAV.map(group => {
    return {
      ...group,
      items: group.items.filter(item => {
        if (isStaffOnly) {
          return item.key === 'summary' || item.key === 'checkin';
        }
        return true;
      })
    };
  }).filter(group => group.items.length > 0);

  return (
    <>
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-[100] w-[270px]
          bg-[#111827] border-r border-sky-400/[0.12]
          flex flex-col py-6
          transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${open ? 'translate-x-0 shadow-[8px_0_40px_rgba(0,0,0,0.5)]' : '-translate-x-full shadow-none'}
        `}
      >
        <div className="px-5 pb-5 border-b border-sky-400/[0.12] flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500 tracking-[0.06em] uppercase font-medium mb-0.5">
              Sự kiện
            </p>
            <p className="text-[14px] font-bold text-sky-400 leading-snug line-clamp-2">
              {eventName ?? '—'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 bg-sky-400/[0.08] border border-sky-400/[0.15] rounded-lg p-1.5 text-slate-400 cursor-pointer flex items-center justify-center hover:text-slate-200 hover:bg-sky-400/[0.14] transition-colors"
          >
            <MdChevronLeft size={20} />
          </button>
        </div>

        <nav className="!static !inset-auto !z-auto !bg-transparent !backdrop-blur-none !shadow-none !p-0 flex-1 px-3 pt-4 flex flex-col gap-1 overflow-y-auto">
          <button
            onClick={() => {
              navigate('/organizer/events');
              onClose();
            }}
            className="flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-100 hover:bg-[#1a2235] transition-colors w-full"
          >
            <MdArrowBack size={15} />
            Quản trị sự kiện
          </button>

          <div className="mx-0 my-2 border-t border-sky-400/[0.08]" />

          {}
          {filteredNav.map((group, groupIdx) => (
            <div
              key={group.group}
              className={`flex flex-col gap-0.5 ${groupIdx > 0 ? 'mt-1' : ''}`}
            >
              <div className="flex items-center gap-1.5 pt-3 pb-1 px-3">
                <span className="text-slate-600">{GROUP_ICONS[group.group]}</span>
                <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-slate-600 whitespace-nowrap">
                  {group.group}
                </span>
              </div>
              {group.items.map((item) => (
                <NavLink
                  key={item.key}
                  to={`${basePath}/${item.path}`}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg
                    text-[13.5px] font-medium no-underline
                    transition-colors duration-150
                    ${
                      isActive
                        ? 'text-sky-400 bg-sky-400/10'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-[#1a2235]'
                    }
                  `}
                >
                  <span className="shrink-0 w-5 flex items-center justify-center opacity-80">
                    {NAV_ICONS[item.key] ?? (
                      <span className="w-[15px] h-[15px] block rounded bg-slate-700/50" />
                    )}
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="px-5 pt-4 border-t border-sky-400/[0.12] flex items-center gap-2">
          <TbCube3dSphere className="text-slate-600 shrink-0" size={13} />
          <span className="text-[10px] tracking-[0.08em] uppercase text-slate-600">
            On-chain verified
          </span>
        </div>
      </aside>
    </>
  );
};