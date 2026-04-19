import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { MdPeopleOutline, MdLogout, MdCheckCircleOutline } from 'react-icons/md';
import type { EventDetailContext } from '../../../types/organizer.type';
import CheckInTable from '../../../components/organizer-detail-event/CheckInTable';
import EmptyState from '../../../components/common/EmptyState';
import { MOCK_CHECKIN_SUMMARY_BY_EVENT } from '../../../mocks/checkin.mock';

/* ══════════════════════════════════════════
   EventCheckInPage — Trang "Check-in"
   DonutRing giữ nguyên SVG vì nó là chart (data viz, không phải icon)
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
    <div className="max-w-[960px] mx-auto animate-[vtx-fade_0.35s_ease]">
      <h2 className="text-base sm:text-lg font-bold text-white mb-5">Check-in</h2>

      {/* Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3 md:gap-4 mb-6">
        {/* Donut Card */}
        <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 sm:gap-6">
          <div className="min-w-0">
            <p className="text-[12px] sm:text-[13px] text-slate-500 mb-1">Đã check-in</p>
            <p className="text-xl sm:text-2xl font-bold text-white font-mono">
              {checkedIn.toLocaleString('vi-VN')}
              <span className="text-sm sm:text-base text-slate-600 font-normal ml-1">vé</span>
            </p>
            <p className="text-[11.5px] sm:text-[12px] text-slate-600 mt-1.5">
              Đã bán {totalSold.toLocaleString('vi-VN')} vé
            </p>
          </div>
          <DonutRing percent={checkinPercent} color="#eab308" size={100} />
        </div>

        {/* Side stats — 2 cột trên mobile, stacked trên desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          <div className="bg-[#0d1117] border border-white/[0.06] rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/[0.1] flex items-center justify-center shrink-0 text-emerald-400">
                <MdPeopleOutline size={18} />
              </div>
              <span className="text-[12px] sm:text-[13px] text-slate-400 truncate">
                Trong sự kiện
              </span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">
              {insideNow}
            </span>
          </div>

          <div className="bg-[#0d1117] border border-white/[0.06] rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-rose-500/[0.1] flex items-center justify-center shrink-0 text-rose-400">
                <MdLogout size={18} />
              </div>
              <span className="text-[12px] sm:text-[13px] text-slate-400 truncate">
                Đã ra ngoài
              </span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-rose-400 font-mono">
              {leftVenue}
            </span>
          </div>
        </div>
      </div>

      <h3 className="text-[14px] sm:text-[15px] font-bold text-white mb-3">Chi tiết</h3>
      <CheckInTable rows={tableRows} />

      {checkedIn === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={<MdCheckCircleOutline size={28} />}
            title="Chưa có ai check-in"
            description="Dữ liệu sẽ cập nhật khi khách quét mã QR"
          />
        </div>
      )}
    </div>
  );
}
