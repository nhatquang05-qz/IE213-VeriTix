import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganizerDashboard } from '../../services/organizer-event.service';
import { EVENT_STATUS_CONFIG } from '../../constants/event';
import type {
  OrganizerDashboardResponse,
  OrganizerEventSummary,
} from '../../types/organizer.type';

/* ══════════════════════════════════════════
   ReportsPage — "Quản lý báo cáo"
   
   Sidebar cấp 1, mục "Quản lý báo cáo".
   Hiển thị tổng quan toàn bộ events của Organizer:
   - 3 stat cards: Tổng sự kiện, Vé đã bán, Doanh thu
   - Donut ring tổng vé bán / cung
   - Table: từng event + revenue + sold + status
   ══════════════════════════════════════════ */

/* ── Donut Ring ── */
const DonutRing: React.FC<{ percent: number; color: string; size?: number }> = ({
  percent,
  color,
  size = 120,
}) => {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        className="text-base font-bold" fill={color}>
        {percent}%
      </text>
    </svg>
  );
};

export default function ReportsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<OrganizerDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrganizerDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] gap-3">
        <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-500">Đang tải báo cáo...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Không thể tải dữ liệu báo cáo</p>
      </div>
    );
  }

  const { summary, events } = data;
  const totalSupply = events.reduce((a, e) => a + e.maxSupply, 0);
  const totalSoldPercent = totalSupply > 0 ? Math.round((summary.totalTicketsSold / totalSupply) * 100) : 0;

  return (
    <div className="max-w-[1100px] mx-auto animate-[fadeSlideUp_0.4s_ease]">
      {/* ── Title ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản lý báo cáo</h1>
        <p className="text-[13px] text-slate-600 mt-1">Tổng quan doanh thu và vé bán trên tất cả sự kiện</p>
      </div>

      {/* ── Top Stats + Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px] gap-4 mb-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Total Events */}
          <div className="
            bg-[#0d1117] border border-white/[0.06] rounded-xl p-5
            hover:border-white/[0.1] transition-colors relative overflow-hidden
          ">
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br from-sky-400/20 to-blue-500/20 blur-2xl opacity-40" />
            <div className="relative">
              <div className="text-sky-400/70 mb-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{summary.totalEvents}</p>
              <p className="text-[11px] text-slate-500 mt-1">Tổng sự kiện</p>
            </div>
          </div>

          {/* Tickets Sold */}
          <div className="
            bg-[#0d1117] border border-white/[0.06] rounded-xl p-5
            hover:border-white/[0.1] transition-colors relative overflow-hidden
          ">
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400/20 to-green-500/20 blur-2xl opacity-40" />
            <div className="relative">
              <div className="text-emerald-400/70 mb-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1 3 3 3 3 0 0 1-3 3H5a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1-3-3z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {summary.totalTicketsSold.toLocaleString('vi-VN')}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Vé đã bán</p>
            </div>
          </div>

          {/* Revenue */}
          <div className="
            bg-[#0d1117] border border-white/[0.06] rounded-xl p-5
            hover:border-white/[0.1] transition-colors relative overflow-hidden
          ">
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-2xl opacity-40" />
            <div className="relative">
              <div className="text-amber-400/70 mb-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white font-mono">Ξ {summary.totalRevenueETH}</p>
              <p className="text-[11px] text-slate-500 mt-1">Tổng doanh thu</p>
            </div>
          </div>
        </div>

        {/* Donut */}
        <div className="
          bg-[#0d1117] border border-white/[0.06] rounded-xl
          flex flex-col items-center justify-center p-4
        ">
          <DonutRing percent={totalSoldPercent} color="#eab308" />
          <p className="text-[10px] text-slate-600 mt-2 text-center">
            Tỉ lệ bán vé<br />toàn bộ sự kiện
          </p>
        </div>
      </div>

      {/* ── Events Revenue Table ── */}
      <h2 className="text-[15px] font-bold text-white mb-3">Chi tiết theo sự kiện</h2>
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Sự kiện', 'Trạng thái', 'Vé bán / Tổng', 'Doanh thu (ETH)', ''].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((ev: OrganizerEventSummary) => {
              const st = EVENT_STATUS_CONFIG[ev.status];
              const pct = ev.maxSupply > 0 ? Math.round((ev.sold / ev.maxSupply) * 100) : 0;
              return (
                <tr key={ev._id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {ev.bannerUrl ? (
                        <img src={ev.bannerUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-600/40 to-blue-900/60 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-200 truncate">{ev.name}</p>
                        <p className="text-[10px] text-slate-600 font-mono">#{ev.blockchainId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[12px] text-slate-400 font-mono">
                        {ev.sold}/{ev.maxSupply}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-bold text-white font-mono">Ξ {ev.revenueETH}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => navigate(`/organizer/events/${ev._id}/summary`)}
                      className="text-[12px] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                    >
                      Chi tiết →
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
    </div>
  );
}