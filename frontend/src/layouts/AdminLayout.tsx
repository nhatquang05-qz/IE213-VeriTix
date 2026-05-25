import { useState, useEffect, useCallback } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar, { MobileSidebar } from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { useAuth } from '../contexts/AuthContext';

/* ══════════════════════════════════════════
   AdminLayout — Admin Dashboard
   Sidebar chính + Header + Outlet (page con)

   Desktop: sidebar cố định bên trái (collapsible)
   Mobile (<768px): sidebar ẩn, mở bằng hamburger menu
   ══════════════════════════════════════════ */

const SIDEBAR_EXPANDED_W = 220;
const SIDEBAR_COLLAPSED_W = 68;
const MOBILE_BREAKPOINT = 768;

export default function AdminLayout() {
  const { user } = useAuth();
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
    document.body.classList.add('admin-no-navbar-offset');
    return () => document.body.classList.remove('admin-no-navbar-offset');
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

  // ĐỌC TRỰC TIẾP TỪ LOCALSTORAGE ĐỂ PHÒNG NGỪA RACE CONDITION KHI HARD REFRESH TRÊN URL
  const savedUserStr = localStorage.getItem('user');
  let savedUser = null;
  if (savedUserStr) {
    try {
      savedUser = JSON.parse(savedUserStr);
    } catch (e) {
      console.error(e);
    }
  }

  // Hợp nhất quyền Admin từ Context State và bộ nhớ tạm thời LocalStorage
  const isAuthorizedAdmin = user?.isAdmin || savedUser?.isAdmin;

  if (!isAuthorizedAdmin) {
    return <Navigate to="/" replace />;
  }

  const sidebarWidth = isMobile ? 0 : sidebarExpanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  return (
    <div className="flex min-h-screen bg-[#070a11] overflow-x-hidden">
      {/* ── Desktop Sidebar (position: fixed — out of flex flow) ── */}
      {!isMobile && <AdminSidebar expanded={sidebarExpanded} onToggle={handleToggleSidebar} />}

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
        <AdminHeader onMenuClick={handleToggleSidebar} showMenuBtn={isMobile} />

        {/* Page content */}
        <div className="flex-1 w-full pb-6">
          <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}