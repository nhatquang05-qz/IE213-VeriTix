import { useNavigate } from 'react-router-dom';
import { EVENT_STATUS_CONFIG } from '../../constants/event';
import type { OrganizerEventSummary } from '../../types/organizer.type';

interface EventDetailCardProps {
  event: OrganizerEventSummary;
  index?: number;
}

export default function EventDetailCard({ event, index = 0 }: EventDetailCardProps) {
  const navigate = useNavigate();
  const statusCfg = EVENT_STATUS_CONFIG[event.status];
  const soldPercent = event.maxSupply > 0 ? Math.round((event.sold / event.maxSupply) * 100) : 0;

  const handleClick = () => {
    navigate(`/organizer/events/${event._id}/summary`);
  };

  return (
    <div
      onClick={handleClick}
      className="
        bg-[#0d1117] border border-white/[0.06] rounded-xl overflow-hidden
        hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20
        transition-all duration-300 cursor-pointer group
        animate-[fadeSlideUp_0.4s_ease]
        hover:-translate-y-0.5
      "
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Banner */}
      <div className="relative h-20 sm:h-24 bg-gradient-to-br from-sky-600/40 to-blue-900/60 overflow-hidden">
        {event.bannerUrl && (
          <img
            src={event.bannerUrl}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {/* Status badge overlay */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border backdrop-blur-sm ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Event name + blockchainId */}
        <div className="mb-3">
          <h3 className="text-[14px] font-semibold text-slate-200 truncate mb-1 group-hover:text-white transition-colors">
            {event.name}
          </h3>
          <p className="text-[10px] text-slate-600 font-mono">#{event.blockchainId}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span>Vé bán</span>
            <span className="font-mono text-slate-400">
              {event.sold.toLocaleString('vi-VN')} / {event.maxSupply.toLocaleString('vi-VN')}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
              style={{ width: `${soldPercent}%` }}
            />
          </div>
        </div>

        {/* Revenue + Chevron */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
          <div>
            <p className="text-[10px] text-slate-600 mb-0.5">Doanh thu</p>
            <p className="text-[15px] font-bold text-white font-mono">Ξ {event.revenueETH}</p>
          </div>
          <div className="flex items-center gap-1.5 text-sky-400 group-hover:gap-2 transition-all">
            <span className="text-[11px] font-semibold">Chi tiết</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="translate-x-0 group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
