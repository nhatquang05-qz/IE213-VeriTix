import { useState, useEffect, useMemo } from 'react';

/* ── Child Components ── */
import OrganizerSidebar, { MobileSidebar } from '../components/organizer/OrganizerSidebar';
import OrganizerStatsCard from '../components/organizer/OrganizerStatsCard';
import OrganizerEventList from '../components/organizer/OrganizerEventList';
import type { OrganizerEvent } from '../components/organizer/OrganizerEventList';

/* ══════════════════════════════════════════════════════════
   Veritix — Organizer Dashboard Page
   React · Inline styles · Responsive
   Dữ liệu 100% từ API — KHÔNG dùng Mock Data
   ══════════════════════════════════════════════════════════ */

/* ── Types ── */
type DashboardSummary = {
  totalRevenueETH: string;
  totalTicketsSold: number;
  totalEvents: number;
};

type DashboardData = {
  summary: DashboardSummary;
  events: OrganizerEvent[];
};

const FILTER_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'ACTIVE', label: 'Sắp tới' },
  { id: 'ENDED', label: 'Đã qua' },
  { id: 'DRAFT', label: 'Nháp' },
];

/* ── SVG Icons ── */
const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const RefreshIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);
const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/* ══════════════════════════════════════════════════════════ */

export default function OrganizerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<DashboardData | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  /* ── Responsive breakpoints ── */
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
      if (w < 768) setSidebarExpanded(true); // mobile: ko dùng desktop sidebar
      if (w >= 768 && w < 1024) setSidebarExpanded(false); // tablet: sidebar thu gọn
      if (w >= 1024) setSidebarExpanded(true); // desktop: sidebar mở rộng
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Gọi API GET /api/events/organizer/dashboard ── */
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/events/organizer/dashboard', { headers });

      /* Kiểm tra content-type trước khi parse JSON */
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Server không trả về JSON. Vui lòng kiểm tra lại API endpoint.');
      }

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Lỗi HTTP ${res.status}`);
      }

      const json: DashboardData = await res.json();
      setData(json);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải dữ liệu';
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ── Filter events ── */
  const filteredEvents = useMemo(() => {
    const events = data?.events ?? [];
    const q = query.trim().toLowerCase();
    return events.filter((ev) => {
      const matchQ = !q || ev.name.toLowerCase().includes(q) || String(ev.blockchainId).includes(q);
      const matchS = statusFilter === 'all' || ev.status === statusFilter;
      return matchQ && matchS;
    });
  }, [data?.events, query, statusFilter]);

  const summary = data?.summary;

  /*
    Layout quan trọng:
    - Desktop (≥1024): sidebar fixed 220px bên trái → main marginLeft = 10
    - Tablet (768–1023): sidebar fixed 68px (thu gọn) → main marginLeft = 10
    - Mobile (<768): KHÔNG có desktop sidebar → main marginLeft = 0, dùng MobileSidebar (drawer overlay)
  */
  const sidebarW = isMobile ? 0 : sidebarExpanded ? 10 : 10;
  const compact = isMobile;

  return (
    <>
      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Be Vietnam Pro', sans-serif; overflow-x: hidden; }

        @keyframes vtx-spin { to { transform: rotate(360deg); } }
        .vtx-spinner { animation: vtx-spin 0.7s linear infinite; }

        @keyframes vtx-tooltip-in {
          from { opacity: 0; transform: translateY(-50%) translateX(-6px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }

        @keyframes vtx-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vtx-anim { animation: vtx-fade-up 0.4s ease-out both; }
        .vtx-anim-d1 { animation-delay: 0.04s; }
        .vtx-anim-d2 { animation-delay: 0.10s; }
        .vtx-anim-d3 { animation-delay: 0.16s; }
        .vtx-anim-d4 { animation-delay: 0.22s; }
        .vtx-anim-d5 { animation-delay: 0.28s; }

        .vtx-search:focus { border-color: #38bdf8 !important; }
        .vtx-search::placeholder { color: #94a3b8; }
        .vtx-btn:hover { background: rgba(56,189,248,0.08) !important; color: #38bdf8 !important; }
        .vtx-toggle-btn:hover { color: #38bdf8 !important; background: rgba(56,189,248,0.15) !important; }
        .vtx-filter:hover { color: #f1f5f9 !important; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,179,237,0.18); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(99,179,237,0.32); }
      `}</style>

      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          background: '#0b1120',
          color: '#f1f5f9',
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }}
      >
        {/* ══ Desktop/Tablet Sidebar (fixed bên trái, ẩn trên mobile) ══ */}
        {!isMobile && (
          <OrganizerSidebar
            expanded={sidebarExpanded}
            onToggle={() => setSidebarExpanded((p) => !p)}
          />
        )}

        {/* ══ Mobile Drawer (chỉ hiện trên mobile, overlay) ══ */}
        {isMobile && (
          <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        )}

        {/* ══ Main Content ══ */}
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            marginLeft: sidebarW,
            padding: isMobile ? '18px 14px' : '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 16 : 24,
            transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
            minWidth: 0,
          }}
        >
          {/* ── Header ── */}
          <div
            className="vtx-anim vtx-anim-d1"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Mobile hamburger */}
              {isMobile && (
                <button
                  className="vtx-btn"
                  onClick={() => setMobileMenuOpen(true)}
                  style={{
                    background: '#1a2235',
                    border: '1px solid rgba(99,179,237,0.22)',
                    borderRadius: 8,
                    padding: 7,
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  <MenuIcon />
                </button>
              )}
              <div>
                <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#f1f5f9' }}>
                  Sự kiện của tôi
                </h1>
                <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
                  Tổng quan hoạt động tổ chức sự kiện
                </p>
              </div>
            </div>
            <button
              className="vtx-btn"
              onClick={fetchDashboard}
              style={{
                background: '#1a2235',
                border: '1px solid rgba(99,179,237,0.22)',
                color: '#94a3b8',
                padding: '7px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontFamily: "'Be Vietnam Pro', sans-serif",
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <RefreshIcon /> Làm mới
            </button>
          </div>

          {/* ── Stats Grid ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : isTablet
                  ? 'repeat(2, 1fr)'
                  : 'repeat(3, 1fr)',
              gap: 14,
            }}
          >
            <div className="vtx-anim vtx-anim-d2">
              <OrganizerStatsCard
                label="Tổng doanh thu"
                value={parseFloat(summary?.totalRevenueETH ?? '0').toFixed(4)}
                unit="ETH"
                tone="cyan"
              />
            </div>
            <div className="vtx-anim vtx-anim-d3">
              <OrganizerStatsCard
                label="Vé đã bán"
                value={(summary?.totalTicketsSold ?? 0).toLocaleString()}
                tone="green"
              />
            </div>
            <div className="vtx-anim vtx-anim-d4">
              <OrganizerStatsCard
                label="Số sự kiện"
                value={summary?.totalEvents ?? 0}
                tone="purple"
              />
            </div>
          </div>

          {/* ── Controls: Search + Filter ── */}
          <div
            className="vtx-anim vtx-anim-d4"
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}
          >
            <div style={{ flex: 1, minWidth: isMobile ? 140 : 200, position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  pointerEvents: 'none',
                  display: 'flex',
                }}
              >
                <SearchIcon />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isMobile ? 'Tìm kiếm…' : 'Tìm kiếm theo tên hoặc mã sự kiện…'}
                className="vtx-search"
                style={{
                  width: '100%',
                  background: '#111827',
                  border: '1px solid rgba(99,179,237,0.22)',
                  borderRadius: 9,
                  padding: '9px 12px 9px 36px',
                  fontSize: 13.5,
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  color: '#f1f5f9',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                background: '#111827',
                border: '1px solid rgba(99,179,237,0.12)',
                borderRadius: 9,
                padding: 3,
                gap: 2,
              }}
            >
              {FILTER_TABS.map((tab) => {
                const isActive = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={isActive ? '' : 'vtx-filter'}
                    style={{
                      padding: isMobile ? '6px 10px' : '6px 14px',
                      borderRadius: 7,
                      fontSize: 12.5,
                      fontWeight: 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      border: 'none',
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      color: isActive ? '#0b1120' : '#94a3b8',
                      background: isActive ? '#38bdf8' : 'transparent',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Event List Section ── */}
          <div
            className="vtx-anim vtx-anim-d5"
            style={{
              background: '#111827',
              border: '1px solid rgba(99,179,237,0.12)',
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: isMobile ? '12px 14px' : '16px 20px',
                borderBottom: '1px solid rgba(99,179,237,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>
                Danh sách sự kiện
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  background: 'rgba(56,189,248,0.12)',
                  color: '#38bdf8',
                  padding: '2px 9px',
                  borderRadius: 20,
                }}
              >
                {filteredEvents.length} sự kiện
              </span>
            </div>
            <OrganizerEventList
              events={filteredEvents}
              loading={loading}
              error={error}
              compact={compact}
            />
          </div>
        </main>
      </div>
    </>
  );
}
