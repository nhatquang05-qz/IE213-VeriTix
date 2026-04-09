import { useState, useEffect, useMemo } from 'react';

/* ── Child Components ── */
import OrganizerSidebar from './OrganizerSidebar';
import OrganizerStatsCard from './OrganizerStatsCard';
import OrganizerEventList from './OrganizerEventList';

/* ══════════════════════════════════════════════════════════
   Veritix — Organizer Dashboard Page
   React + Tailwind v4 · Component-based architecture
   ══════════════════════════════════════════════════════════ */

/* ── Mock data for preview (fallback khi API chưa sẵn sàng) ── */
const MOCK_DATA = {
  summary: {
    totalRevenueETH: '12.4500',
    totalTicketsSold: 1842,
    totalEvents: 7,
  },
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

/* ── Filter tabs config ── */
const FILTER_TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'ACTIVE', label: 'Sắp tới' },
  { id: 'ENDED', label: 'Đã qua' },
  { id: 'DRAFT', label: 'Nháp' },
];

/* ── SVG Icons ── */
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

/* ══════════════════════════════════════════════════════════
   MAIN DASHBOARD PAGE
   ══════════════════════════════════════════════════════════ */

export default function OrganizerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  /* ── Gọi API GET /api/events/organizer/dashboard ── */
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/events/organizer/dashboard', { headers });

      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      setData(json);
    } catch (err) {
      /* Fallback to mock data for preview */
      console.warn('API unavailable, using mock data:', err.message);
      setData(MOCK_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ── Lọc sự kiện theo tên/mã + trạng thái ── */
  const filteredEvents = useMemo(() => {
    const events = data?.events ?? [];
    const q = query.trim().toLowerCase();
    return events.filter((ev) => {
      const matchQuery =
        !q || ev.name.toLowerCase().includes(q) || String(ev.blockchainId).includes(q);
      const matchStatus = statusFilter === 'all' || ev.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [data?.events, query, statusFilter]);

  const summary = data?.summary;

  return (
    <div className="flex min-h-screen bg-[#0b1120] text-[#f1f5f9] font-[family-name:'Be_Vietnam_Pro',sans-serif]">
      {/* ── Sidebar (component con) ── */}
      <OrganizerSidebar />

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto p-[28px_32px] flex flex-col gap-[24px] max-sm:p-[18px_14px] max-sm:gap-[16px]">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-[12px]">
          <div>
            <h1 className="text-[22px] font-bold text-[#f1f5f9]">Sự kiện của tôi</h1>
            <p className="text-[13px] text-[#94a3b8] mt-[2px]">
              Tổng quan hoạt động tổ chức sự kiện
            </p>
          </div>
          <button
            onClick={fetchDashboard}
            className={`
              bg-[#1a2235] border border-[rgba(99,179,237,0.22)]
              text-[#94a3b8] px-[14px] py-[7px] rounded-[8px]
              text-[13px] font-[family-name:'Be_Vietnam_Pro',sans-serif]
              cursor-pointer flex items-center gap-[6px]
              transition-colors duration-150
              hover:bg-[rgba(56,189,248,0.08)] hover:text-[#38bdf8]
            `}
          >
            <RefreshIcon />
            Làm mới
          </button>
        </div>

        {/* ── Stats Grid (component con: OrganizerStatsCard) ── */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[14px] max-sm:grid-cols-1">
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

        {/* ── Controls: Search + Filter Tabs ── */}
        <div className="flex gap-[10px] flex-wrap items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none flex">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên hoặc mã sự kiện…"
              className={`
                w-full bg-[#111827] border border-[rgba(99,179,237,0.22)]
                rounded-[9px] py-[9px] pl-[36px] pr-[12px]
                text-[13.5px] font-[family-name:'Be_Vietnam_Pro',sans-serif]
                text-[#f1f5f9] outline-none
                transition-[border-color] duration-150
                placeholder:text-[#94a3b8]
                focus:border-[#38bdf8]
              `}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-[#111827] border border-[rgba(99,179,237,0.12)] rounded-[9px] p-[3px] gap-[2px]">
            {FILTER_TABS.map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`
                    px-[14px] py-[6px] rounded-[7px]
                    text-[12.5px] font-medium cursor-pointer
                    whitespace-nowrap border-none
                    font-[family-name:'Be_Vietnam_Pro',sans-serif]
                    transition-colors duration-150
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

        {/* ── Event List Section (component con: OrganizerEventList) ── */}
        <div className="bg-[#111827] border border-[rgba(99,179,237,0.12)] rounded-[14px] overflow-hidden">
          {/* Section Header */}
          <div className="px-[20px] py-[16px] border-b border-[rgba(99,179,237,0.12)] flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[#f1f5f9]">Danh sách sự kiện</span>
            <span className="text-[11px] font-semibold bg-[rgba(56,189,248,0.12)] text-[#38bdf8] px-[9px] py-[2px] rounded-[20px]">
              {filteredEvents.length} sự kiện
            </span>
          </div>

          {/* Event List */}
          <OrganizerEventList events={filteredEvents} loading={loading} error={error} />
        </div>
      </main>
    </div>
  );
}
