import { useState, useEffect, useMemo } from 'react';

/* ── Child Components ── */
import OrganizerSidebar, { MobileSidebar } from '../components/organizer/OrganizerSidebar';
import OrganizerStatsCard from '../components/organizer/OrganizerStatsCard';
import OrganizerEventList from '../components/organizer/OrganizerEventList';

/* ══════════════════════════════════════════════════════════
   Veritix — Organizer Dashboard Page
   React + Tailwind v4 · Component-based · Responsive
   ══════════════════════════════════════════════════════════ */

/* ── Mock data (fallback khi API chưa sẵn sàng) ── */
const MOCK_DATA = {
  summary: { totalRevenueETH: '12.4500', totalTicketsSold: 1842, totalEvents: 7 },
  events: [
    {
      _id: '1',
      blockchainId: 1001,
      name: 'Blockchain Summit Vietnam 2026',
      status: 'ACTIVE',
      maxSupply: 500,
      sold: 347,
      revenueETH: '5.2300',
      bannerUrl: '',
    },
    {
      _id: '2',
      blockchainId: 1002,
      name: 'Web3 Music Festival — Đà Lạt',
      status: 'ACTIVE',
      maxSupply: 1200,
      sold: 890,
      revenueETH: '3.8100',
      bannerUrl: '',
    },
    {
      _id: '3',
      blockchainId: 1003,
      name: 'NFT Art Exhibition Saigon',
      status: 'ENDED',
      maxSupply: 300,
      sold: 300,
      revenueETH: '2.1000',
      bannerUrl: '',
    },
    {
      _id: '4',
      blockchainId: 1004,
      name: 'DeFi Workshop Hà Nội',
      status: 'DRAFT',
      maxSupply: 150,
      sold: 0,
      revenueETH: '0.0000',
      bannerUrl: '',
    },
    {
      _id: '5',
      blockchainId: 1005,
      name: 'Metaverse Gaming Night',
      status: 'ENDED',
      maxSupply: 200,
      sold: 185,
      revenueETH: '1.3100',
      bannerUrl: '',
    },
    {
      _id: '6',
      blockchainId: 1006,
      name: 'DAO Governance Meetup — Đắk Lắk',
      status: 'ACTIVE',
      maxSupply: 80,
      sold: 42,
      revenueETH: '0.0000',
      bannerUrl: '',
    },
    {
      _id: '7',
      blockchainId: 1007,
      name: 'Crypto Charity Gala 2026',
      status: 'DRAFT',
      maxSupply: 400,
      sold: 78,
      revenueETH: '0.0000',
      bannerUrl: '',
    },
  ],
};

const FILTER_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'ACTIVE', label: 'Sắp tới' },
  { id: 'ENDED', label: 'Đã qua' },
  { id: 'DRAFT', label: 'Nháp' },
];

/* ── Icons ── */
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
  const [data, setData] = useState<typeof MOCK_DATA | null>(null);
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
      if (w < 768) setSidebarExpanded(true);
      if (w >= 768 && w < 1024) setSidebarExpanded(false);
      if (w >= 1024) setSidebarExpanded(true);
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
      if (!res.ok) throw new Error('HTTP ' + res.status);
      setData(await res.json());
    } catch (err) {
      console.warn('API unavailable, using mock data:', (err as Error).message);
      setData(MOCK_DATA);
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
  const sidebarW = isMobile ? 0 : sidebarExpanded ? 220 : 68;

  return (
    <div className="flex min-h-screen bg-[#0b1120] text-[#f1f5f9] font-[family-name:'Be_Vietnam_Pro',sans-serif]">
      {/* Desktop/Tablet Sidebar */}
      {!isMobile && (
        <OrganizerSidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((p) => !p)}
        />
      )}

      {/* Mobile Drawer */}
      {isMobile && <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />}

      {/* ── Main Content ── */}
      <main
        className="flex-1 overflow-auto flex flex-col min-w-0"
        style={{
          marginLeft: sidebarW,
          padding: isMobile ? '18px 14px' : '28px 32px',
          gap: isMobile ? 16 : 24,
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-[12px]">
          <div className="flex items-center gap-[12px]">
            {/* Mobile hamburger */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="bg-[#1a2235] border border-[rgba(99,179,237,0.22)] rounded-[8px] p-[7px] text-[#94a3b8] cursor-pointer flex items-center justify-center transition-colors duration-150 hover:bg-[rgba(56,189,248,0.08)] hover:text-[#38bdf8]"
              >
                <MenuIcon />
              </button>
            )}
            <div>
              <h1
                className={`font-bold text-[#f1f5f9] ${isMobile ? 'text-[18px]' : 'text-[22px]'}`}
              >
                Sự kiện của tôi
              </h1>
              <p className="text-[13px] text-[#94a3b8] mt-[2px]">
                Tổng quan hoạt động tổ chức sự kiện
              </p>
            </div>
          </div>
          <button
            onClick={fetchDashboard}
            className="bg-[#1a2235] border border-[rgba(99,179,237,0.22)] text-[#94a3b8] px-[14px] py-[7px] rounded-[8px] text-[13px] cursor-pointer flex items-center gap-[6px] transition-colors duration-150 hover:bg-[rgba(56,189,248,0.08)] hover:text-[#38bdf8]"
          >
            <RefreshIcon /> Làm mới
          </button>
        </div>

        {/* ── Stats Grid ── */}
        <div
          className="grid gap-[14px]"
          style={{
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          }}
        >
          <OrganizerStatsCard
            label="Tổng doanh thu"
            value={parseFloat(summary?.totalRevenueETH ?? '0').toFixed(4)}
            unit="ETH"
            tone="cyan"
          />
          <OrganizerStatsCard
            label="Vé đã bán"
            value={(summary?.totalTicketsSold ?? 0).toLocaleString()}
            tone="green"
          />
          <OrganizerStatsCard label="Số sự kiện" value={summary?.totalEvents ?? 0} tone="purple" />
        </div>

        {/* ── Controls ── */}
        <div className="flex gap-[10px] flex-wrap items-center">
          <div className="flex-1 min-w-[140px] md:min-w-[200px] relative">
            <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none flex">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isMobile ? 'Tìm kiếm…' : 'Tìm kiếm theo tên hoặc mã sự kiện…'}
              className="w-full bg-[#111827] border border-[rgba(99,179,237,0.22)] rounded-[9px] py-[9px] pl-[36px] pr-[12px] text-[13.5px] text-[#f1f5f9] outline-none transition-[border-color] duration-150 placeholder:text-[#94a3b8] focus:border-[#38bdf8]"
            />
          </div>
          <div className="flex bg-[#111827] border border-[rgba(99,179,237,0.12)] rounded-[9px] p-[3px] gap-[2px]">
            {FILTER_TABS.map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`
                    rounded-[7px] text-[12.5px] font-medium cursor-pointer
                    whitespace-nowrap border-none transition-colors duration-150
                    ${isMobile ? 'px-[10px] py-[6px]' : 'px-[14px] py-[6px]'}
                    ${
                      isActive
                        ? 'bg-[#38bdf8] text-[#0b1120]'
                        : 'bg-transparent text-[#94a3b8] hover:text-[#f1f5f9]'
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Event List Section ── */}
        <div className="bg-[#111827] border border-[rgba(99,179,237,0.12)] rounded-[14px] overflow-hidden">
          <div
            className={`border-b border-[rgba(99,179,237,0.12)] flex items-center justify-between ${isMobile ? 'px-[14px] py-[12px]' : 'px-[20px] py-[16px]'}`}
          >
            <span className="text-[14px] font-semibold text-[#f1f5f9]">Danh sách sự kiện</span>
            <span className="text-[11px] font-semibold bg-[rgba(56,189,248,0.12)] text-[#38bdf8] px-[9px] py-[2px] rounded-[20px]">
              {filteredEvents.length} sự kiện
            </span>
          </div>
          <OrganizerEventList
            events={filteredEvents}
            loading={loading}
            error={error}
            compact={isMobile}
          />
        </div>
      </main>
    </div>
  );
}
