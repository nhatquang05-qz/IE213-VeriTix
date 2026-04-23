import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EVENT_STATUS_CONFIG, CATEGORY_EMOJI, CARD_GRADIENTS } from '../../constants/event';
import type { OrganizerEvent } from '../../types/organizer.type';
import {
  LuCalendarDays,
  LuChevronRight,
  LuClock3,
  LuMapPin,
  LuSquarePen,
  LuTicket,
  LuUserRound,
} from 'react-icons/lu';

export type { OrganizerEvent } from '../../types/organizer.type';

/* ── Utils (An toàn hóa) ── */
const fmtDate = (iso?: string) => {
  if (!iso) return 'Chưa cập nhật';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'Ngày không hợp lệ';
  }
};

const fmtTime = (iso?: string) => {
  if (!iso) return '--:--';
  try {
    return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--:--';
  }
};

/* ── QuickAction ── */
const QAction: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({
  icon,
  label,
  onClick,
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 hover:text-sky-400 hover:bg-sky-400/[0.06] transition-all group"
  >
    <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

/* ══════════════════════════════════════════ */
type Props = { event: OrganizerEvent; index: number };

const OrganizerEventCard: React.FC<Props> = ({ event, index }) => {
  const navigate = useNavigate();

  // Safeguard: Fallback status config nếu event.status bị sai/thiếu
  const st = (event?.status && EVENT_STATUS_CONFIG[event.status]) || {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/20',
    dot: 'bg-slate-500',
    label: event?.status || 'Unknown',
  };

  // Safeguard: Toán học an toàn
  const maxSupply = event?.maxSupply || 0;
  const currentMinted = event?.currentMinted || 0;
  const progress = maxSupply > 0 ? Math.round((currentMinted / maxSupply) * 100) : 0;

  // Safeguard: Gradient array an toàn
  const gradientsList =
    CARD_GRADIENTS && CARD_GRADIENTS.length > 0 ? CARD_GRADIENTS : ['from-slate-800 to-slate-900'];
  const gradient = gradientsList[index % gradientsList.length];

  // Safeguard: Category Emoji
  const categoryEmoji = (event?.category && CATEGORY_EMOJI[event.category]) || '✨';

  const goDetail = () => navigate(`/organizer/events/${event?._id || ''}/summary`);
  const goEdit = () => navigate(`/organizer/events/${event?._id || ''}/edit`);
  const goMembers = () => navigate(`/organizer/events/${event?._id || ''}/members`);
  const goVouchers = () => navigate(`/organizer/events/${event?._id || ''}/vouchers`);

  if (!event) return null; // Chặn render nếu object event null hoàn toàn

  return (
    <div
      className="group bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
      style={{ animation: `fadeSlideUp 0.4s ease ${index * 60}ms both` }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="relative sm:w-52 md:w-60 h-40 sm:h-auto shrink-0 overflow-hidden">
          {event.bannerUrl ? (
            <img
              src={event.bannerUrl}
              alt={event.name || 'Banner'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full min-h-[140px] bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <span className="text-4xl opacity-60">{categoryEmoji}</span>
            </div>
          )}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-[10px] font-semibold text-white/80 border border-white/10">
            {event.category || 'Chưa phân loại'}
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-mono text-sky-300/80 border border-sky-400/10">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
            </svg>
            #{event.blockchainId || 'N/A'}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-base md:text-lg font-bold text-slate-100 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                {event.name || 'Sự kiện không có tên'}
              </h3>
              <span
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${st.bg} ${st.text} ${st.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                {st.label}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 text-[13px]">
              <div className="flex items-center gap-2 text-slate-400">
                <LuCalendarDays size={14} className="text-sky-400/60 shrink-0" />
                <span className="min-w-0">
                  {fmtTime(event.startTime)}, {fmtDate(event.startTime)}
                </span>
              </div>

              <div className="flex items-start gap-2 text-slate-500">
                <LuMapPin size={13} className="text-emerald-400/50 shrink-0 mt-[2px]" />
                <span className="min-w-0 sm:truncate whitespace-normal sm:whitespace-nowrap break-words sm:break-normal">
                  {event.location || 'Chưa cập nhật địa điểm'}
                </span>
              </div>
            </div>
          </div>
          {/* Progress + Price */}
          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-500 font-medium">Vé đã bán</span>
                <span className="text-[11px] text-slate-400 font-semibold font-mono">
                  {currentMinted.toLocaleString('vi-VN')}
                  <span className="text-slate-600"> / {maxSupply.toLocaleString('vi-VN')}</span>
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${progress >= 90 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : progress >= 50 ? 'bg-gradient-to-r from-sky-500 to-cyan-400' : 'bg-gradient-to-r from-blue-500 to-blue-400'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-slate-600 mb-0.5">Giá vé</p>
              <p className="text-sm font-bold text-white font-mono">
                {event.price || '0'}{' '}
                <span className="text-[11px] text-slate-400 font-medium">ETH</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-white/[0.04] px-2 py-1 flex items-center justify-between">
        <div className="flex items-center gap-0.5 overflow-x-auto">
          <QAction onClick={goDetail} label="Tổng quan" icon={<LuClock3 size={15} />} />

          <QAction onClick={goMembers} label="Thành viên" icon={<LuUserRound size={15} />} />

          <QAction onClick={goVouchers} label="Voucher" icon={<LuTicket size={18} />} />

          <QAction onClick={goEdit} label="Chỉnh sửa" icon={<LuSquarePen size={15} />} />
        </div>
        <button
          onClick={goDetail}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-semibold text-sky-400 hover:text-sky-300 hover:bg-sky-400/[0.08] transition-all shrink-0"
        >
          Xem chi tiết
          <LuChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default OrganizerEventCard;
