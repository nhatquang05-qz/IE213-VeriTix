import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* ══════════════════════════════════════════
   MainLayout — Public + User pages
   
   Mục đích: gom Navbar + Footer cho toàn bộ route public
   và route user (/user/*).
   
   Navbar hiện tại nhận `children`, nên ta truyền Outlet vào
   đúng pattern — không sửa Navbar.tsx (ngoài phạm vi Organizer).
   ══════════════════════════════════════════ */

export default function MainLayout() {
  return (
    <>
      <Navbar>
        <Outlet />
      </Navbar>
      <Footer />
    </>
  );
}
