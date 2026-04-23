import { MdCalendarMonth, MdLink, MdMenu } from 'react-icons/md';

const fmtDateTime = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return (
    d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }) +
    ' - ' +
    d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  );
};

interface EventDetailHeaderProps {
  event: any;
  statusCfg: any;
  /** Mobile: hiện nút hamburger để mở drawer sidebar */
  onMenuClick?: () => void;
  showMenuBtn?: boolean;
}

export default function EventDetailHeader({
  event,
  statusCfg,
  onMenuClick,
  showMenuBtn = false,
}: EventDetailHeaderProps) {
  return (
    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06] bg-[#0a0e1a]/60 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        {/* Left */}
        <div className="min-w-0 flex-1 flex items-start gap-2.5">
          {/* Hamburger — chỉ hiện trên mobile */}
          {showMenuBtn && (
            <button
              onClick={onMenuClick}
              className="shrink-0 mt-0.5 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors"
            >
              <MdMenu size={20} />
            </button>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
              <h1 className="text-[15px] sm:text-lg font-bold text-white truncate max-w-full">
                {event.name}
              </h1>
              <span
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-[11px] font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11.5px] sm:text-[12px]">
              <span className="flex items-center gap-1.5 text-slate-500">
                <MdCalendarMonth className="text-slate-600 shrink-0" size={14} />
                <span className="truncate">{fmtDateTime(event.startTime)}</span>
              </span>
              {event.blockchainId && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-400/[0.06] border border-sky-400/10 text-[10px] font-mono text-sky-400/70">
                  <MdLink size={11} />#{event.blockchainId}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick stats */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex flex-col items-center px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[9px] sm:text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">
              Vé bán
            </span>
            <span className="text-[12px] sm:text-sm font-bold text-white font-mono whitespace-nowrap">
              {event.currentMinted}
              <span className="text-slate-600 font-normal">/{event.maxSupply}</span>
            </span>
          </div>
          <div className="hidden sm:flex flex-col items-center px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[9px] sm:text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">
              Giá vé
            </span>
            <span className="text-[12px] sm:text-sm font-bold text-white font-mono whitespace-nowrap">
              Ξ {event.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
