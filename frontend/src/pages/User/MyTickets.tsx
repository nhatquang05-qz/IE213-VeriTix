import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { MdConfirmationNumber, MdClose, MdStorefront } from 'react-icons/md';
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

  // States cho tính năng Resell
  const [resellTicket, setResellTicket] = useState<Ticket | null>(null);
  const [resellPrice, setResellPrice] = useState<number | ''>('');
  const [isSubmittingResell, setIsSubmittingResell] = useState(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const fetchMyTickets = async () => {
    try {
      setIsLoading(true);
      // const response = await api.get('/tickets/my-tickets'); 
      // setTickets(Array.isArray(response.data) ? response.data : []);

      const MOCK_MY_TICKETS: Ticket[] = [
        {
          _id: 'mock-1',
          blockchainTicketId: 101,
          eventId: {
            _id: 'event-1',
            name: 'SpaceSpeakers Live Concert 2026',
            startTime: '2026-12-20T19:00:00.000Z',
            location: 'Sân vận động QK7',
            bannerUrl: 'https://images.unsplash.com/photo-1540039155732-d674d40b4c8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          purchasePrice: '1500000',
          createdAt: new Date().toISOString(),
          status: 'SOLD' // Trạng thái hợp lệ (hiện nút Mở QR và Bán lại)
        },
        {
          _id: 'mock-2',
          blockchainTicketId: 102,
          eventId: {
            _id: 'event-2',
            name: 'Workshop Web3 & Blockchain',
            startTime: '2026-11-15T08:00:00.000Z',
            location: 'Đại học CNTT (UIT)',
            bannerUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          purchasePrice: '500000',
          createdAt: new Date().toISOString(),
          status: 'RESELLING' // Trạng thái đang rao bán (Khoá nút QR)
        },
        {
          _id: 'mock-3',
          blockchainTicketId: 103,
          eventId: {
            _id: 'event-3',
            name: 'Rap Việt All-Star',
            startTime: '2026-10-10T19:00:00.000Z',
            location: 'SECC Q7',
            bannerUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          purchasePrice: '2000000',
          createdAt: new Date().toISOString(),
          status: 'USED' // Trạng thái đã check-in
        }
      ];

      // Giả lập thời gian mạng load mất 0.5 giây
      setTimeout(() => {
        setTickets(MOCK_MY_TICKETS);
        setIsLoading(false);
      }, 500);

    } catch (error) {
      toast.error('Lỗi khi tải danh sách vé!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQR = async (ticketId: string, blockchainTicketId: number) => {
    try {
      setIsSigning(ticketId);
      if (!window.ethereum) throw new Error("Vui lòng cài đặt ví MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const timestamp = Math.floor(Date.now() / 1000);
      const message = `Check-in VeriTix\nTicket ID: ${blockchainTicketId}\nTimestamp: ${timestamp}`;

      const signature = await signer.signMessage(message);
      setSelectedQR(JSON.stringify({ blockchainTicketId, timestamp, signature }));
    } catch (error: any) {
      if (error.code === 4001) toast.error("Bạn đã từ chối ký xác nhận.");
      else toast.error(error.message || "Lỗi tạo QR");
    } finally {
      setIsSigning(null);
    }
  };

  const handleResellSubmit = async () => {
    if (!resellTicket || !resellPrice) return;
    
    const originalPrice = parseInt(resellTicket.purchasePrice);
    const maxPrice = originalPrice * 0.9; // Max 90%

    if (resellPrice > maxPrice) {
      toast.error(`Giá bán tối đa chỉ được 90% giá gốc (${maxPrice.toLocaleString()} VND)`);
      return;
    }

    try {
      setIsSubmittingResell(true);
      // TODO: Tích hợp Smart Contract ký giao dịch List NFT lên sàn ở đây
      // API call mô phỏng cập nhật trạng thái
      // await api.post(`/tickets/${resellTicket._id}/resell`, { price: resellPrice });

      // Cập nhật state local ngay lập tức để UX mượt
      setTickets(prev => prev.map(t => 
        t._id === resellTicket._id ? { ...t, status: 'RESELLING' } : t
      ));
      
      toast.success("Đã niêm yết vé lên chợ Resell thành công!");
      setResellTicket(null);
      setResellPrice('');
    } catch (error) {
      toast.error("Lỗi khi niêm yết vé!");
    } finally {
      setIsSubmittingResell(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-[vtx-fade_0.4s_ease]">
      <div className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <MdConfirmationNumber className="text-blue-400" />
            Vé của tôi
          </h1>
          <p className="text-slate-400 mt-2">Quản lý và bán lại các vé NFT bạn đang sở hữu</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : tickets.length === 0 ? (
        <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-12 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Bạn chưa có vé nào!</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden group flex flex-col">
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={ticket.eventId?.bannerUrl || 'https://via.placeholder.com/400x200'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  {ticket.status === 'SOLD' && <span className="bg-emerald-500 text-white px-3 py-1 text-[11px] font-bold rounded-full shadow-lg">HỢP LỆ</span>}
                  {ticket.status === 'USED' && <span className="bg-slate-600 text-white px-3 py-1 text-[11px] font-bold rounded-full shadow-lg">ĐÃ CHECK-IN</span>}
                  {ticket.status === 'RESELLING' && <span className="bg-purple-500 text-white px-3 py-1 text-[11px] font-bold rounded-full shadow-lg animate-pulse">ĐANG RESELL</span>}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{ticket.eventId?.name}</h3>
                
                <div className="space-y-2 mt-auto pt-4 border-t border-white/5 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Mã vé:</span><span className="font-mono text-blue-400">#{ticket.blockchainTicketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giá mua gốc:</span><span className="text-white font-semibold">{parseInt(ticket.purchasePrice).toLocaleString()} VND</span>
                  </div>
                </div>
                
                {ticket.status === 'SOLD' ? (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setResellTicket(ticket)}
                      className="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 py-2.5 rounded-xl font-medium transition-colors"
                    >
                      Bán lại vé
                    </button>
                    <button 
                      onClick={() => handleGenerateQR(ticket._id, ticket.blockchainTicketId)}
                      disabled={isSigning === ticket._id}
                      className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                      {isSigning === ticket._id ? 'Đang ký...' : 'Mở mã QR'}
                    </button>
                  </div>
                ) : ticket.status === 'RESELLING' ? (
                  <button disabled className="mt-5 w-full bg-slate-800 border border-slate-700 text-slate-500 py-2.5 rounded-xl font-medium cursor-not-allowed">
                    Tạm khoá QR (Đang rao bán)
                  </button>
                ) : (
                  <button disabled className="mt-5 w-full bg-slate-800 border border-slate-700 text-slate-500 py-2.5 rounded-xl font-medium cursor-not-allowed">Vé đã qua sử dụng</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- RESELL MODAL --- */}
      {resellTicket && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#111827] border border-purple-500/30 rounded-2xl p-6 max-w-md w-full relative animate-[vtx-fade_0.3s_ease]">
            <button onClick={() => setResellTicket(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <MdClose size={24} />
            </button>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <MdStorefront className="text-purple-500" /> Bán lại vé của bạn
            </h2>
            <p className="text-sm text-slate-400 mb-6 border-b border-white/10 pb-4">
              Giá niêm yết không được vượt quá 90% giá gốc. Nền tảng sẽ thu phí 5% trên giá bạn bán được.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Giá mua gốc:</span>
                <span className="font-bold text-white">{parseInt(resellTicket.purchasePrice).toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Giá bán tối đa (90%):</span>
                <span className="font-bold">{(parseInt(resellTicket.purchasePrice) * 0.9).toLocaleString()} đ</span>
              </div>

              <div className="mt-4">
                <label className="block text-slate-400 mb-2 font-medium">Nhập giá bạn muốn bán (VND)</label>
                <input 
                  type="number"
                  value={resellPrice}
                  onChange={(e) => setResellPrice(Number(e.target.value))}
                  placeholder="VD: 500000"
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {resellPrice !== '' && resellPrice > 0 && (
                <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl mt-4 space-y-2">
                  <div className="flex justify-between text-slate-400">
                    <span>Phí sàn (5%):</span>
                    <span>-{(resellPrice * 0.05).toLocaleString()} đ</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-purple-500/20">
                    <span>Thực nhận:</span>
                    <span className="text-purple-400">{(resellPrice - (resellPrice * 0.05)).toLocaleString()} đ</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleResellSubmit}
                disabled={isSubmittingResell || !resellPrice || resellPrice > (parseInt(resellTicket.purchasePrice) * 0.9)}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingResell ? 'Đang xử lý...' : 'Xác nhận niêm yết'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- QR MODAL (Giữ nguyên) --- */}
      {selectedQR && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#111827] border border-blue-500/30 rounded-2xl p-8 max-w-sm w-full flex flex-col items-center relative">
            <button onClick={() => setSelectedQR(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <MdClose size={24} />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Mã QR Check-in</h2>
            <div className="bg-white p-4 rounded-xl shadow-[0_0_30px_rgba(0,102,255,0.2)] my-4">
              <QRCodeSVG value={selectedQR} size={220} level="H" includeMargin={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}