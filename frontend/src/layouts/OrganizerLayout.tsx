import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import OrganizerSidebar, { MobileSidebar } from '../components/organizer/OrganizerSidebar';
import OrganizerHeader from '../components/organizer/OrganizerHeader';

/* ══════════════════════════════════════════
   OrganizerLayout — Cấp 1
   Sidebar chính + Header + Outlet (page con)

   Desktop: sidebar cố định bên trái (collapsible)
   Mobile (<768px): sidebar ẩn, mở bằng hamburger menu
   ══════════════════════════════════════════ */

const SIDEBAR_EXPANDED_W = 220;
const SIDEBAR_COLLAPSED_W = 68;
const MOBILE_BREAKPOINT = 768;

export default function OrganizerLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ── Responsive detection ──
  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    setIsMobile(mobile);
    // Tự động thu sidebar khi chuyển sang mobile
    if (mobile) {
      setSidebarExpanded(false);
      setMobileOpen(false);
    }
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  useEffect(() => {
    document.body.classList.add('organizer-no-navbar-offset');
    return () => document.body.classList.remove('organizer-no-navbar-offset');
  }, []);

  // ── Handlers ──
  const handleToggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarExpanded((prev) => !prev);
    }
  }, [isMobile]);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const sidebarWidth = isMobile ? 0 : sidebarExpanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  return (
    /*
     * ROOT CAUSE FIX — White space bên phải:
     *
     * Sidebar dùng `position: fixed` → thoát khỏi flex flow, không chiếm
     * không gian trong flex container.
     *
     * `flex-1` trên <main> → browser tính width = 100% viewport.
     * `marginLeft: sidebarWidth` → đẩy main sang phải thêm sidebarWidth px.
     *
     * Kết quả: main tràn ra ngoài viewport đúng sidebarWidth px
     * → white space bên phải.
     *
     * Fix:
     *   1. overflow-x-hidden trên root container.
     *   2. Bỏ flex-1, dùng width: calc(100% - sidebarWidth) trên main.
     *   3. min-w-0: cho phép flex child shrink dưới content size.
     */
    <div className="flex min-h-screen bg-[#070a11] overflow-x-hidden">
      {/* ── Desktop Sidebar (position: fixed — out of flex flow) ── */}
      {!isMobile && <OrganizerSidebar expanded={sidebarExpanded} onToggle={handleToggleSidebar} />}

      {/* ── Mobile Sidebar Drawer ── */}
      {isMobile && <MobileSidebar open={mobileOpen} onClose={handleCloseMobile} />}

      {/* ── Main Content Area ── */}
      <main
        className="flex flex-col min-h-screen min-w-0 transition-[margin-left,width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        {/* Header: sticky, hiện nút hamburger trên mobile */}
        <OrganizerHeader onMenuClick={handleToggleSidebar} showMenuBtn={isMobile} />

        {/* Page content */}
        <div className="flex-1 w-full py-6">
          <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
