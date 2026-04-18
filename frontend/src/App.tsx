import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import OrganizerLayout from './layouts/OrganizerLayout';
import OrganizerEventDetailLayout from './layouts/OrganizerEventDetailLayout';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import EventList from './pages/EventList';
// import EventDetail from './pages/EventDetail';

// // User pages
// import ProfilePage from './pages/User/ProfilePage';
// import MyTickets from './pages/User/MyTickets';

// Organizer pages
import MyEventsPage from './pages/Organizer/MyEventsPage';
import CreateEventPage from './pages/Organizer/CreateEventPage';
import ReportsPage from './pages/Organizer/ReportsPage';
import TermsPage from './pages/Organizer/TermsPage';

// Organizer Event Detail pages
import EventSummaryPage from './pages/Organizer/OrganizerEventDetail/EventSummaryPage';
import EventCheckInPage from './pages/Organizer/OrganizerEventDetail/EventCheckInPage';
import EventMembersPage from './pages/Organizer/OrganizerEventDetail/EventMembersPage';
import EventEditPage from './pages/Organizer/OrganizerEventDetail/EventEditPage';
import EventVouchersPage from './pages/Organizer/OrganizerEventDetail/EventVouchersPage';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Web3Provider>
          <Routes>
            {/* ═══ PUBLIC — MainLayout (Navbar + Footer) ═══ */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetail />} /> */}
            </Route>

            {/* ═══ USER — MainLayout + Auth Guard ═══ */}
            <Route element={<MainLayout />}>
              {/* <Route path="/user/profile" element={<ProfilePage />} />
              <Route path="/user/my-tickets" element={<MyTickets />} /> */}
            </Route>

            {/* ═══ ORGANIZER CẤP 1 — OrganizerLayout (sidebar chính) ═══ */}
            {/* OrganizerLayout = OrganizerSidebar + OrganizerHeader + <Outlet/> */}
            <Route path="/organizer" element={<OrganizerLayout />}>
              {/* /organizer → redirect tới /organizer/events */}
              <Route index element={<Navigate to="events" replace />} />
              <Route path="events" element={<MyEventsPage />} />
              <Route path="events/create" element={<CreateEventPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="terms" element={<TermsPage />} />
            </Route>

            {/* ═══ ORGANIZER CẤP 2 — OrganizerEventDetailLayout (sidebar RIÊNG, KHÔNG nested) ═══ */}
            {/* Khi vào chi tiết sự kiện → dùng sidebar riêng có nút Back, KHÔNG hiện sidebar cấp 1 */}
            <Route path="/organizer/events/:eventId" element={<OrganizerEventDetailLayout />}>
              <Route index element={<Navigate to="summary" replace />} />
              <Route path="summary" element={<EventSummaryPage />} />
              <Route path="checkin" element={<EventCheckInPage />} />
              <Route path="members" element={<EventMembersPage />} />
              <Route path="edit" element={<EventEditPage />} />
              <Route path="vouchers" element={<EventVouchersPage />} />
              <Route path="vouchers/create" element={<EventVouchersPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Web3Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
