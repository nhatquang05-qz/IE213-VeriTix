import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { MdConfirmationNumber, MdClose } from 'react-icons/md';
import { QRCodeSVG } from 'qrcode.react';

interface Ticket {
  _id: string;
  blockchainTicketId: number;
  eventId: {
    _id: string;
    name: string;
    startTime: string;
    location: string;
    bannerUrl: string;
  };
  purchasePrice: string;
  createdAt: string;
  status: 'AVAILABLE' | 'SOLD' | 'RESELLING' | 'USED';
}

export default function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState<string | null>(null);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const fetchMyTickets = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tickets/my-tickets'); 
      setTickets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách vé!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQR = async (ticketId: string, blockchainTicketId: number) => {
    try {
      setIsSigning(ticketId);
      
      if (!window.ethereum) {
        throw new Error("Vui lòng cài đặt ví MetaMask để ký xác nhận tạo mã QR");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const timestamp = Math.floor(Date.now() / 1000);
      const message = `Check-in VeriTix\nTicket ID: ${blockchainTicketId}\nTimestamp: ${timestamp}`;

      const signature = await signer.signMessage(message);

      const qrPayload = JSON.stringify({
        blockchainTicketId,
        timestamp,
        signature
      });

      setSelectedQR(qrPayload);
    } catch (error: any) {
      if (error.code === 4001) {
        toast.error("Bạn đã từ chối ký xác nhận. Không thể tạo mã QR.");
      } else {
        toast.error(error.message || "Đã xảy ra lỗi khi tạo mã QR");
      }
    } finally {
      setIsSigning(null);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-[vtx-fade_0.4s_ease]">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <MdConfirmationNumber className="text-blue-400" />
          Vé của tôi
        </h1>
        <p className="text-slate-400 mt-2">Quản lý tất cả các vé NFT bạn đã sở hữu trên VeriTix</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400">Đang truy xuất dữ liệu từ blockchain...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
            <MdConfirmationNumber size={40} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Bạn chưa có vé nào!</h3>
          <p className="text-slate-400 mb-6">Hãy khám phá các sự kiện và sở hữu cho mình những tấm vé NFT độc bản.</p>
          <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors no-underline">
            Khám phá sự kiện
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-colors group flex flex-col">
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={ticket.eventId?.bannerUrl || 'https://via.placeholder.com/400x200'} 
                  alt={ticket.eventId?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  {ticket.status === 'SOLD' && <span className="bg-emerald-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">CHƯA SỬ DỤNG</span>}
                  {ticket.status === 'USED' && <span className="bg-slate-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">ĐÃ CHECK-IN</span>}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{ticket.eventId?.name || 'Sự kiện VeriTix'}</h3>
                
                <div className="space-y-2 mt-auto pt-4 border-t border-white/5 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Mã vé On-chain:</span>
                    <span className="font-mono text-blue-400">#{ticket.blockchainTicketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời gian diễn ra:</span>
                    <span>{ticket.eventId?.startTime ? new Date(ticket.eventId.startTime).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'TBD'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời gian mua:</span>
                    <span className="text-[#8cceea]">{new Date(ticket.createdAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giá thanh toán:</span>
                    <span className="text-white font-semibold">{parseInt(ticket.purchasePrice).toLocaleString()} VND</span>
                  </div>
                </div>
                
                {ticket.status === 'SOLD' ? (
                  <button 
                    onClick={() => handleGenerateQR(ticket._id, ticket.blockchainTicketId)}
                    disabled={isSigning === ticket._id}
                    className="mt-5 w-full cursor-pointer bg-[linear-gradient(135deg,rgba(0,102,255,0.2),rgba(0,212,255,0.1))] hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSigning === ticket._id ? 'Đang chờ ký xác nhận...' : 'Xem mã QR Check-in'}
                  </button>
                ) : (
                  <button 
                    disabled
                    className="mt-5 w-full bg-slate-800 border border-slate-700 text-slate-500 py-2.5 rounded-xl font-medium cursor-not-allowed"
                  >
                    Vé đã được sử dụng
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedQR && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#111827] border border-blue-500/30 rounded-2xl p-8 max-w-sm w-full flex flex-col items-center relative animate-[vtx-fade_0.3s_ease]">
            <button
              onClick={() => setSelectedQR(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <MdClose size={24} />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Mã QR Check-in</h2>
            <p className="text-[13px] text-red-400 mb-6 text-center leading-relaxed">
              Mã bảo mật động này chỉ có hiệu lực trong vòng <b>5 phút</b>.<br/>
              Tuyệt đối không chụp màn hình gửi cho người khác!
            </p>
            <div className="bg-white p-4 rounded-xl shadow-[0_0_30px_rgba(0,102,255,0.2)]">
              <QRCodeSVG value={selectedQR} size={220} level="H" includeMargin={false} />
            </div>
            <button
              onClick={() => setSelectedQR(null)}
              className="mt-8 w-full cursor-pointer bg-[linear-gradient(135deg,#0ea5e9_0%,#2563eb_62%,#1d4ed8_100%)] text-white py-3 rounded-xl font-semibold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}