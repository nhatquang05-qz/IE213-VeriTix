import React from 'react';
import { useOutletContext } from 'react-router-dom';
import type { EventDetailContext } from '../../../types/organizer.type';
import CheckInTable from '../../../components/organizer-detail-event/CheckInTable';
import EmptyState from '../../../components/common/EmptyState';
import { MOCK_CHECKIN_SUMMARY_BY_EVENT } from '../../../mocks/checkin.mock';

/* ══════════════════════════════════════════
   EventCheckInPage — Trang "Check-in" (Fixed centering)

   Thay đổi:
   - ✅ Wrap bằng `max-w-[960px] mx-auto` để căn giữa, cân 2 bên trên desktop
   - ✅ Grid responsive: 1 cột < 768px, 1 cột wide 768-1023px, 2 cột >= 1024px
   - ✅ Side stats auto stretch theo chiều cao donut card
   ══════════════════════════════════════════ */

const DonutRing: React.FC<{ percent: number; color: string; size?: number }> = ({
  percent,
  color,
  size = 110,
}) => {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="9"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="9"
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
        className="text-sm font-bold"
        fill={color}
      >
        {percent} %
      </text>
    </svg>
  );
};

export default function EventCheckInPage() {
  const { event } = useOutletContext<EventDetailContext>();
  if (!event) return null;

  const totalSold = event.currentMinted;
  const summary = MOCK_CHECKIN_SUMMARY_BY_EVENT[event._id] || {
    checkedIn: 0,
    insideNow: 0,
    leftVenue: 0,
  };
  const { checkedIn, insideNow, leftVenue } = summary;
  const checkinPercent = totalSold > 0 ? Math.round((checkedIn / totalSold) * 100) : 0;
  const price = parseFloat(event.price || '0');

  const tableRows = [{ ticketType: 'Vé tiêu chuẩn', price, checkedIn, totalSold }];

  return (
    /* Căn giữa + cân 2 bên bằng mx-auto */
    <div className="max-w-[960px] mx-auto animate-[vtx-fade_0.35s_ease]">
      <h2 className="text-lg font-bold text-white mb-5">Check-in</h2>

      {/* ── Overview Row ──
          Mobile  (<768): 1 cột dọc
          Tablet  (md):   1 cột (donut + side stats stack)
          Desktop (lg):   2 cột 1fr + 280px
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 mb-6">
        {/* Donut Card */}
        <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between gap-6">
          <div>
            <p className="text-[13px] text-slate-500 mb-1">Đã check-in</p>
            <p className="text-2xl font-bold text-white font-mono">
              {checkedIn.toLocaleString('vi-VN')}
              <span className="text-base text-slate-600 font-normal ml-1">vé</span>
            </p>
            <p className="text-[12px] text-slate-600 mt-1.5">
              Đã bán {totalSold.toLocaleString('vi-VN')} vé
            </p>
          </div>
          <DonutRing percent={checkinPercent} color="#eab308" />
        </div>

        {/* Side Stats – stretch chiều cao để cân với donut card */}
        <div className="flex flex-col gap-3">
          <div className="flex-1 bg-[#0d1117] border border-white/[0.06] rounded-xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/[0.1] flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="text-emerald-400"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="text-[13px] text-slate-400">Trong sự kiện</span>
            </div>
            <span className="text-xl font-bold text-emerald-400 font-mono">{insideNow}</span>
          </div>

          <div className="flex-1 bg-[#0d1117] border border-white/[0.06] rounded-xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/[0.1] flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="text-rose-400"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <span className="text-[13px] text-slate-400">Đã ra ngoài</span>
            </div>
            <span className="text-xl font-bold text-rose-400 font-mono">{leftVenue}</span>
          </div>
        </div>
      </div>

      {/* ── Detail Table ── */}
      <h3 className="text-[15px] font-bold text-white mb-3">Chi tiết</h3>
      <CheckInTable rows={tableRows} />

      {/* ── Empty State ── */}
      {checkedIn === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
            title="Chưa có ai check-in"
            description="Dữ liệu sẽ cập nhật khi khách quét mã QR"
          />
        </div>
      )}
    </div>
  );
}
