import { useState, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MdErrorOutline } from 'react-icons/md';
import EventDetailSidebar, {
  MobileEventDetailSidebar,
} from '../components/organizer-detail-event/EventDetailSidebar';
import { useEventDetail } from '../hooks/useEventDetail';
import EventDetailHeader from '../components/organizer-detail-event/EventDetailHeader';
import { EVENT_STATUS_CONFIG } from '../constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SIDEBAR_EXPANDED_W = 220;
const SIDEBAR_COLLAPSED_W = 68;

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

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const handleOpenDrawer = useCallback(() => setMobileDrawerOpen(true), []);
  const handleCloseDrawer = useCallback(() => setMobileDrawerOpen(false), []);

  useEffect(() => {
    document.body.classList.add('organizer-no-navbar-offset');
    return () => document.body.classList.remove('organizer-no-navbar-offset');
  }, []);

  if (loading) return <LoadingSpinner text="Đang tải sự kiện..." />;
  if (error || !event)
    return <EventDetailError message={error ?? 'Không tìm thấy sự kiện'} onRetry={fetchEvent} />;

  const statusCfg = EVENT_STATUS_CONFIG[event.status];
  const sidebarWidth = isMobile ? 0 : sidebarExpanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  return (
    /*
     * overflow-x-hidden: ngăn horizontal scroll do fixed sidebar + marginLeft.
     * min-h-screen thay vì min-h-[calc(100vh-64px)] để cover toàn màn hình.
     */
    <div className="flex min-h-screen bg-[#070a11] overflow-x-hidden">
      {/* ── Desktop Sidebar (position: fixed) ── */}
      {!isMobile && (
        <EventDetailSidebar
          eventId={eventId!}
          eventName={event.name}
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((prev) => !prev)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      {isMobile && (
        <MobileEventDetailSidebar
          open={mobileDrawerOpen}
          onClose={handleCloseDrawer}
          eventId={eventId!}
          eventName={event.name}
        />
      )}

      {/* ── Main Content Area ── */}
      {/*
       * BUG FIX (same as OrganizerLayout):
       * EventDetailSidebar là `position: fixed` → thoát flex flow.
       * flex-1 trên main = 100% viewport + marginLeft → tràn ra ngoài.
       *
       * Fix: dùng width: calc(100% - sidebarWidth) + min-w-0 thay vì flex-1.
       */}
      <main
        className="flex flex-col min-h-screen min-w-0 transition-[margin-left,width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        {/* Event Header Bar — truyền hamburger props cho mobile */}
        <EventDetailHeader
          event={event}
          statusCfg={statusCfg}
          showMenuBtn={isMobile}
          onMenuClick={handleOpenDrawer}
        />

        <div className="flex-1 px-4 sm:px-6 py-5 bg-[#070a11]">
          <Outlet context={outletContext} />
        </div>
      </main>
    </div>
  );
}
