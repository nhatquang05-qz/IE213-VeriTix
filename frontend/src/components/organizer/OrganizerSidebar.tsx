import React, { createContext, useContext, useState } from 'react';

/* ══════════════════════════════════════════
   OrganizerSidebar — Collapsible + Mobile Drawer
   Veritix Organizer Dashboard
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
const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

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
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: expanded ? 10 : 0,
        padding: expanded ? '9px 12px' : '9px 0',
        justifyContent: expanded ? 'flex-start' : 'center',
        borderRadius: 8,
        fontSize: 13.5,
        fontWeight: 500,
        textDecoration: 'none',
        color: active ? '#38bdf8' : hovered ? '#f1f5f9' : '#94a3b8',
        background: active ? 'rgba(56,189,248,0.1)' : hovered ? '#1a2235' : 'transparent',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 15, opacity: 0.8, flexShrink: 0, width: 20, textAlign: 'center' }}>
        {icon}
      </span>
      <span
        style={{
          overflow: 'hidden',
          transition: 'width 0.3s ease, opacity 0.2s ease',
          width: expanded ? 150 : 0,
          opacity: expanded ? 1 : 0,
        }}
      >
        {text}
      </span>

      {/* Tooltip khi sidebar thu gọn */}
      {!expanded && hovered && (
        <div
          style={{
            position: 'absolute',
            left: 'calc(100% + 14px)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#1e293b',
            color: '#f1f5f9',
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 12.5,
            fontWeight: 500,
            border: '1px solid rgba(99,179,237,0.18)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            zIndex: 200,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'vtx-tooltip-in 0.15s ease-out',
          }}
        >
          {text}
          <div
            style={{
              position: 'absolute',
              left: -5,
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)',
              width: 10,
              height: 10,
              background: '#1e293b',
              borderLeft: '1px solid rgba(99,179,237,0.18)',
              borderBottom: '1px solid rgba(99,179,237,0.18)',
            }}
          />
        </div>
      )}
    </a>
  );
};

/* ══════════════════════════════════════════
   Desktop Sidebar (collapsible, fixed bên trái)
   ══════════════════════════════════════════ */
type OrganizerSidebarProps = {
  expanded: boolean;
  onToggle: () => void;
};

const OrganizerSidebar: React.FC<OrganizerSidebarProps> = ({ expanded, onToggle }) => {
  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        width: expanded ? 220 : 68,
        background: '#111827',
        borderRight: '1px solid rgba(99,179,237,0.12)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}
    >
      {/* Logo + Toggle */}
      <div
        style={{
          padding: expanded ? '0 20px 20px' : '0 0 20px',
          borderBottom: '1px solid rgba(99,179,237,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: expanded ? 'space-between' : 'center',
          gap: 8,
          minHeight: 44,
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            transition: 'width 0.3s ease, opacity 0.25s ease',
            width: expanded ? 120 : 0,
            opacity: expanded ? 1 : 0,
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.04em', color: '#38bdf8' }}
          >
            Veritix
          </span>
          <p
            style={{
              fontSize: 11,
              color: '#94a3b8',
              marginTop: 2,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Organizer Center
          </p>
        </div>
        <button
          onClick={onToggle}
          className="vtx-toggle-btn"
          style={{
            background: 'rgba(56,189,248,0.08)',
            border: '1px solid rgba(99,179,237,0.15)',
            borderRadius: 8,
            padding: 6,
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s, background 0.15s',
            flexShrink: 0,
          }}
        >
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Nav */}
      <SidebarContext.Provider value={{ expanded }}>
        <nav
          style={{
            flex: 1,
            padding: expanded ? '16px 12px' : '16px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <SidebarItem key={item.key} icon={item.icon} text={item.label} active={item.active} />
          ))}
        </nav>
      </SidebarContext.Provider>

      {/* Footer */}
      <div
        style={{
          padding: expanded ? '16px 20px 0' : '16px 0 0',
          borderTop: '1px solid rgba(99,179,237,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: expanded ? 'flex-start' : 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'rgba(56,189,248,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: '#38bdf8',
            flexShrink: 0,
          }}
        >
          OR
        </div>
        <div
          style={{
            overflow: 'hidden',
            transition: 'width 0.3s ease, opacity 0.25s ease',
            width: expanded ? 140 : 0,
            opacity: expanded ? 1 : 0,
            whiteSpace: 'nowrap',
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#f1f5f9',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Organizer
          </p>
          <p
            style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            dashboard@veritix.io
          </p>
        </div>
      </div>
    </aside>
  );
};

/* ══════════════════════════════════════════
   Mobile Sidebar Drawer (overlay)
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
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          width: 270,
          background: '#111827',
          borderRight: '1px solid rgba(99,179,237,0.12)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 0',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: open ? '8px 0 40px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '0 20px 20px',
            borderBottom: '1px solid rgba(99,179,237,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span
              style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.04em', color: '#38bdf8' }}
            >
              Veritix
            </span>
            <p
              style={{
                fontSize: 11,
                color: '#94a3b8',
                marginTop: 2,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Organizer Center
            </p>
          </div>
          <button
            onClick={onClose}
            className="vtx-toggle-btn"
            style={{
              background: 'rgba(56,189,248,0.08)',
              border: '1px solid rgba(99,179,237,0.15)',
              borderRadius: 8,
              padding: 6,
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <XIcon />
          </button>
        </div>
        {/* Nav */}
        <nav
          style={{
            flex: 1,
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              href="#"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                color: item.active ? '#38bdf8' : '#94a3b8',
                background: item.active ? 'rgba(56,189,248,0.1)' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ fontSize: 16, opacity: 0.8 }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        {/* Footer */}
        <div
          style={{
            padding: '16px 20px 0',
            borderTop: '1px solid rgba(99,179,237,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'rgba(56,189,248,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#38bdf8',
              flexShrink: 0,
            }}
          >
            OR
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>Organizer</p>
            <p style={{ fontSize: 11, color: '#94a3b8' }}>dashboard@veritix.io</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default OrganizerSidebar;
