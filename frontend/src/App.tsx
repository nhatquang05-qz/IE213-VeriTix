import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config/contract';
import MyTickets from './pages/User/MyTickets';
// Layouts
import MainLayout from './layouts/MainLayout';
import OrganizerLayout from './layouts/OrganizerLayout';
import OrganizerEventDetailLayout from './layouts/OrganizerEventDetailLayout';

// Public pages
import HomePage from './pages/HomePage';
import EventDetail from './pages/EventDetail'; // Giữ lại của bro
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

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

// Giữ lại hàm Test Connection của 
function TestConnection() {
  const [status, setStatus] = useState("");
  const [address, setAddress] = useState("");

  const handleConnect = async () => {
    if (!window.ethereum) {
      setStatus("Chưa cài MetaMask!");
      return;
    }
    try {
      setStatus("Đang kết nối...");
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      console.log("Contract Instance:", contract);
      
      setStatus("KẾT NỐI THÀNH CÔNG");
      alert(`Đã kết nối ví: ${userAddress}\nContract Address: ${CONTRACT_ADDRESS}`);
    } catch (error) {
      console.error(error);
      setStatus(`Lỗi: ${(error as any)?.message || error}`);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>TEST KẾT NỐI BLOCKCHAIN</h2>
      <p>Contract Address: <b>{CONTRACT_ADDRESS}</b></p>
      <button 
        onClick={handleConnect}
        style={{ padding: '15px 30px', fontSize: '18px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        {address ? "Đã kết nối" : "Kết nối Ví & Contract"}
      </button>
      <div style={{ marginTop: '20px', fontWeight: 'bold', color: 'blue' }}>{status}</div>
      {address && <p>Ví của bạn: {address}</p>}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <BrowserRouter>
          <Routes>
            {/* ═══ PUBLIC — MainLayout (Navbar + Footer) ═══ */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/events/:id" element={<EventDetail />} /> {/* Khôi phục link Detail của bro */}
              <Route path="/test" element={<TestConnection />} /> {/* Khôi phục link Test của bro */}
            </Route>

            {/* ═══ ORGANIZER CẤP 1 — OrganizerLayout (sidebar chính) ═══ */}
            <Route path="/organizer" element={<OrganizerLayout />}>
              <Route index element={<Navigate to="events" replace />} />
              <Route path="events" element={<MyEventsPage />} />
              <Route path="events/create" element={<CreateEventPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="terms" element={<TermsPage />} />
            </Route>

            {/* ═══ ORGANIZER CẤP 2 — OrganizerEventDetailLayout (sidebar RIÊNG) ═══ */}
            <Route path="/organizer/events/:eventId" element={<OrganizerEventDetailLayout />}>
              <Route index element={<Navigate to="summary" replace />} />
              <Route path="summary" element={<EventSummaryPage />} />
              <Route path="checkin" element={<EventCheckInPage />} />
              <Route path="members" element={<EventMembersPage />} />
              <Route path="edit" element={<EventEditPage />} />
              <Route path="vouchers" element={<EventVouchersPage />} />
              <Route path="vouchers/create" element={<EventVouchersPage />} />
            </Route>
            {/* ═══ USER — MainLayout + Auth Guard ═══ */}
            <Route element={<MainLayout />}>
              {/* <Route path="/user/profile" element={<ProfilePage />} /> */}
              <Route path="/user/my-tickets" element={<MyTickets />} /> {/* Mở khóa dòng này */}
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;