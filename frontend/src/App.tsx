import { useState } from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers'; 
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config/contract'; 

import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


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
        style={{
          padding: '15px 30px', 
          fontSize: '18px', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {address ? "Đã kết nối" : "Kết nối Ví & Contract"}
      </button>

      <div style={{ marginTop: '20px', fontWeight: 'bold', color: 'blue' }}>
        {status}
      </div>

      {address && <p>Ví của bạn: {address}</p>}
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {}
          <Route path="/test" element={<TestConnection />} />
          
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;