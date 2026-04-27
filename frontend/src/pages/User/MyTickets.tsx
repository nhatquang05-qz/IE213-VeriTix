import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { MdConfirmationNumber, MdClose, MdAccessTime, MdLocationOn } from 'react-icons/md';
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

  const handleGenerateQR = async (ticket: Ticket) => {
    try {
      setIsSigning(ticket._id);
      
      if (!window.ethereum) {
        throw new Error("Vui lòng cài đặt ví MetaMask để ký xác nhận tạo mã QR");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const timestamp = Math.floor(Date.now() / 1000);
      const eventTime = new Date(ticket.eventId.startTime).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const message = `VERITIX CHECK-IN\nSự kiện: ${ticket.eventId.name}\nThời gian: ${eventTime}\nID Vé: #${ticket.blockchainTicketId}\nTimestamp: ${timestamp}`;

      const signature = await signer.signMessage(message);

      const qrPayload = JSON.stringify({
        "Sự Kiện": ticket.eventId.name,
        "Thời Gian": eventTime,
        "ID Vé": `#${ticket.blockchainTicketId}`,
        blockchainTicketId: ticket.blockchainTicketId,
        timestamp,
        signature
      }, null, 2);

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
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-4">
            <MdConfirmationNumber className="text-blue-500" />
            Vé của tôi
          </h1>
          <p className="text-slate-400 mt-2">
            Bạn đang sở hữu <span className="text-blue-400 font-bold">{tickets.length}</span> vé NFT trên hệ thống VeriTix
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400">Đang truy xuất dữ liệu từ blockchain...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-[#0d1117] border border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
            <MdConfirmationNumber size={48} className="text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Bạn chưa có vé nào!</h3>
          <p className="text-slate-400 mb-8">Hãy khám phá các sự kiện và sở hữu cho mình những tấm vé NFT độc bản.</p>
          <a href="/" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 no-underline">
            Khám phá sự kiện
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-[#161b22] border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/40 transition-all group shadow-2xl flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={ticket.eventId?.bannerUrl || 'https://via.placeholder.com/400x200'} 
                  alt={ticket.eventId?.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4">
                  {ticket.status === 'SOLD' && (
                    <span className="bg-emerald-500 text-white px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                      Hợp lệ
                    </span>
                  )}
                  {ticket.status === 'USED' && (
                    <span className="bg-slate-700 text-slate-300 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                      Đã Check-in
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{ticket.eventId?.name || 'Sự kiện VeriTix'}</h3>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <MdAccessTime className="text-blue-400" size={18} />
                    <span>{ticket.eventId?.startTime ? new Date(ticket.eventId.startTime).toLocaleString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <MdLocationOn className="text-blue-400" size={18} />
                    <span className="line-clamp-1">{ticket.eventId?.location}</span>
                  </div>
                </div>

                <div className="bg-black/20 rounded-2xl p-4 border border-white/5 space-y-2 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Mã vé On-chain:</span>
                    <span className="text-blue-400 font-mono font-bold">#{ticket.blockchainTicketId}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Thời gian mua:</span>
                    <span className="text-slate-300">{new Date(ticket.createdAt).toLocaleString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                    })}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Giá thanh toán:</span>
                    <span className="text-white font-bold">{parseInt(ticket.purchasePrice).toLocaleString()} VND</span>
                  </div>
                </div>
                
                {ticket.status === 'SOLD' ? (
                  <button 
                    onClick={() => handleGenerateQR(ticket)}
                    disabled={isSigning === ticket._id}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSigning === ticket._id ? 'Đang chờ ký xác nhận...' : 'HIỂN THỊ MÃ QR'}
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full bg-slate-800 text-slate-500 py-4 rounded-2xl font-bold cursor-not-allowed"
                  >
                    VÉ ĐÃ SỬ DỤNG
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedQR && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
          <div className="bg-[#0d1117] border border-white/10 rounded-[40px] p-10 max-w-md w-full text-center relative shadow-[0_0_100px_rgba(0,102,255,0.2)] animate-[vtx-fade_0.3s_ease]">
            <button
              onClick={() => setSelectedQR(null)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <MdClose size={32} />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">QR Check-in</h2>
              <p className="text-blue-400 text-sm font-medium mt-1">Mã bảo mật có hiệu lực trong 5 phút</p>
            </div>

            <div className="bg-white p-6 rounded-[32px] inline-block shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              <QRCodeSVG value={selectedQR} size={240} level="H" includeMargin={false} />
            </div>

            <div className="mt-8 text-left bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Lưu ý bảo mật:</p>
              <p className="text-slate-300 text-xs leading-relaxed">
                Tuyệt đối không chụp màn hình gửi cho người khác. Nhân viên soát vé sẽ quét trực tiếp mã này trên ứng dụng.
              </p>
            </div>
            
            <button
              onClick={() => setSelectedQR(null)}
              className="mt-6 w-full cursor-pointer bg-slate-800 text-white py-3.5 rounded-2xl font-bold transition-all hover:bg-slate-700"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}