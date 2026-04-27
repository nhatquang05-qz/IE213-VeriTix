import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config/contract';
import LoadingSpinner from './components/common/LoadingSpinner';

import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';

import MainLayout from './layouts/MainLayout';
import OrganizerLayout from './layouts/OrganizerLayout';
import OrganizerEventDetailLayout from './layouts/OrganizerEventDetailLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

// Organizer pages
const MyEventsPage = lazy(() => import('./pages/Organizer/MyEventsPage'));
const CreateEventPage = lazy(() => import('./pages/Organizer/CreateEventPage'));
const ReportsPage = lazy(() => import('./pages/Organizer/ReportsPage'));
const TermsPage = lazy(() => import('./pages/Organizer/TermsPage'));

// Organizer Event Detail pages
const EventSummaryPage = lazy(() => import('./pages/Organizer/OrganizerEventDetail/EventSummaryPage'));
const EventCheckInPage = lazy(() => import('./pages/Organizer/OrganizerEventDetail/EventCheckInPage'));
const EventMembersPage = lazy(() => import('./pages/Organizer/OrganizerEventDetail/EventMembersPage'));
const EventEditPage = lazy(() => import('./pages/Organizer/OrganizerEventDetail/EventEditPage'));
const EventVouchersPage = lazy(() => import('./pages/Organizer/OrganizerEventDetail/EventVouchersPage'));

const MyTickets = lazy(() => import('./pages/User/MyTickets'));

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
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/events/:id" element={<EventDetail />} /> 
                <Route path="/test" element={<TestConnection />} /> 
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
                <Route path="/user/my-tickets" element={<MyTickets />} /> 
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;