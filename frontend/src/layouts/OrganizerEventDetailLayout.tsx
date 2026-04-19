import { Outlet } from 'react-router-dom';
import { MdCalendarMonth, MdLink, MdErrorOutline } from 'react-icons/md';
import EventDetailSidebar from '../components/organizer-detail-event/EventDetailSidebar';
import { EVENT_STATUS_CONFIG } from '../constants/event';
import { useEventDetail } from '../hooks/useEventDetail';

const fmtDateTime = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return (
    d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }) +
    ' - ' +
    d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  );
};

const SIDEBAR_EXPANDED_W = 220;
const SIDEBAR_COLLAPSED_W = 68;

function EventDetailLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px] gap-3">
      <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      <span className="text-sm text-slate-500">Đang tải sự kiện...</span>
    </div>
  );
}

function EventDetailError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/[0.08] border border-rose-500/20 flex items-center justify-center text-rose-400">
        <MdErrorOutline size={26} />
      </div>
      <p className="text-sm text-slate-400">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-[13px] font-medium text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/[0.06] transition-colors cursor-pointer"
      >
        Thử lại
      </button>
    </div>
  );
}

export default function OrganizerEventDetailLayout() {
  const {
    eventId,
    event,
    loading,
    error,
    sidebarExpanded,
    setSidebarExpanded,
    isMobile,
    outletContext,
    fetchEvent,
  } = useEventDetail();

  if (loading) return <EventDetailLoading />;
  if (error || !event)
    return <EventDetailError message={error ?? 'Không tìm thấy sự kiện'} onRetry={fetchEvent} />;

  const statusCfg = EVENT_STATUS_CONFIG[event.status];
  const sidebarWidth = isMobile ? 0 : sidebarExpanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#070a11]">
      {!isMobile && (
        <EventDetailSidebar
          eventId={eventId!}
          eventName={event.name}
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((prev) => !prev)}
        />
      )}

      <main
        className="flex-1 min-w-0 flex flex-col transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Event Header Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06] bg-[#0a0e1a]/60 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            {/* Left */}
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

            {/* Right: Quick stats — hiện trên mobile dạng compact */}
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
              <div className="hidden xs:flex sm:flex flex-col items-center px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/[0.06]">
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

        <div className="flex-1 px-4 sm:px-6 py-5 bg-[#070a11]">
          <Outlet context={outletContext} />
        </div>
      </main>
    </div>
  );
}
