import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuCalendar, LuChevronRight } from 'react-icons/lu';
import { HiOutlineTicket } from 'react-icons/hi';
import { MdCurrencyExchange } from 'react-icons/md';
import { getOrganizerDashboard } from '../../services/organizer-event.service';
import { EVENT_STATUS_CONFIG } from '../../constants/event';
import type { OrganizerDashboardResponse, OrganizerEventSummary } from '../../types/organizer.type';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';

/* ══════════════════════════════════════════
   ReportsPage — "Quản lý báo cáo"
   ══════════════════════════════════════════ */

const ITEMS_PER_PAGE = 4;

/* ── Donut Ring (dùng trong stat card thứ 4) ── */
const DonutRing: React.FC<{ percent: number; color: string; size?: number }> = ({
  percent,
  color,
  size = 72,
}) => {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="8"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
        fontWeight="700"
        fill={color}
      >
        {percent}%
      </text>
    </svg>
  );
};

/* ── Stat card config — reuse icons từ MyEventsPage ── */
const buildStatCards = (
  summary: OrganizerDashboardResponse['summary'],
  totalSoldPercent: number
) => [
  {
    label: 'Tổng sự kiện',
    value: summary.totalEvents.toLocaleString('vi-VN'),
    icon: <LuCalendar size={20} />,
    iconColor: 'text-sky-400',
    glow: 'from-sky-400/20 to-blue-500/20',
    extra: null,
  },
  {
    label: 'Vé đã bán',
    value: summary.totalTicketsSold.toLocaleString('vi-VN'),
    icon: <HiOutlineTicket size={22} />,
    iconColor: 'text-emerald-400',
    glow: 'from-emerald-400/20 to-green-500/20',
    extra: null,
  },
  {
    label: 'Tổng doanh thu',
    value: `Ξ ${summary.totalRevenueETH}`,
    icon: <MdCurrencyExchange size={20} />,
    iconColor: 'text-amber-400',
    glow: 'from-amber-400/20 to-orange-500/20',
    extra: null,
  },
  {
    label: 'Tỉ lệ bán vé',
    value: null, // rendered as donut
    icon: null,
    iconColor: '',
    glow: 'from-yellow-400/15 to-amber-600/15',
    extra: <DonutRing percent={totalSoldPercent} color="#eab308" size={72} />,
  },
];

export default function ReportsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<OrganizerDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getOrganizerDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Đang tải báo cáo..." />;

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Không thể tải dữ liệu báo cáo</p>
      </div>
    );
  }

  const { summary, events } = data;
  const totalSupply = events.reduce((a, e) => a + e.maxSupply, 0);
  const totalSoldPercent =
    totalSupply > 0 ? Math.round((summary.totalTicketsSold / totalSupply) * 100) : 0;

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const paginatedEvents = events.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const statCards = buildStatCards(summary, totalSoldPercent);

  return (
    <div className="w-full max-w-[1100px] mx-auto min-w-0 animate-[fadeSlideUp_0.4s_ease]">
      {/* ── Title ── */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-white tracking-tight">
          Quản lý báo cáo
        </h1>
        <p className="text-[13px] text-slate-600 mt-1">
          Tổng quan doanh thu và vé bán trên tất cả sự kiện
        </p>
      </div>

      {/* ── Stat Cards (4 cards — cùng style MyEventsPage, donut tích hợp card 4) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 sm:mb-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="relative overflow-hidden bg-[#0d1117] border border-white/[0.06] rounded-xl p-4 h-[130px] hover:border-white/[0.1] transition-colors"
          >
            {/* Glow blob */}
            <div
              className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${card.glow} blur-2xl opacity-40`}
            />

            <div className="relative flex flex-col justify-between h-full">
              {card.extra ? (
                /* Card 4 — Donut ring */
                <>
                  <p className="text-[11px] text-slate-500 font-medium">{card.label}</p>
                  <div className="flex items-center justify-center flex-1 pt-1">{card.extra}</div>
                </>
              ) : (
                /* Cards 1–3 — icon + number + label */
                <>
                  <div className={`${card.iconColor} opacity-70`}>{card.icon}</div>
                  <p className="text-xl md:text-2xl font-bold text-white font-mono break-all leading-tight">
                    {card.value}
                  </p>
                  <p className="text-[13px] text-slate-500 font-medium">{card.label}</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Events Revenue Table ── */}
      <h2 className="text-[15px] font-bold text-white mb-3">Chi tiết theo sự kiện</h2>
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-x-auto max-w-full">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Sự kiện', 'Trạng thái', 'Vé bán / Tổng', 'Doanh thu (ETH)', ''].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 sm:px-5 py-3.5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedEvents.map((ev: OrganizerEventSummary) => {
              const st = EVENT_STATUS_CONFIG[ev.status];
              const pct = ev.maxSupply > 0 ? Math.round((ev.sold / ev.maxSupply) * 100) : 0;
              return (
                <tr
                  key={ev._id}
                  className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 sm:px-5 py-3.5 sm:py-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      {ev.bannerUrl ? (
                        <img
                          src={ev.bannerUrl}
                          alt=""
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-sky-600/40 to-blue-900/60 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-200 truncate max-w-[120px] sm:max-w-none">
                          {ev.name}
                        </p>
                        <p className="text-[10px] text-slate-600 font-mono">#{ev.blockchainId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 sm:py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[10px] font-semibold border ${st.bg} ${st.text} ${st.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
                      <span className="whitespace-nowrap">{st.label}</span>
                    </span>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div className="flex-1 max-w-[60px] sm:max-w-[80px] h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[12px] text-slate-400 font-mono whitespace-nowrap">
                        {ev.sold}/{ev.maxSupply}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 sm:py-4">
                    <span className="text-[13px] font-bold text-white font-mono whitespace-nowrap">
                      Ξ {ev.revenueETH}
                    </span>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 sm:py-4">
                    <button
                      onClick={() => navigate(`/organizer/events/${ev._id}/summary`)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold text-sky-400 hover:text-sky-300 hover:bg-sky-400/[0.08] transition-all shrink-0"
                    >
                      Xem chi tiết
                      <LuChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {events.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-slate-600">Chưa có sự kiện nào</p>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
