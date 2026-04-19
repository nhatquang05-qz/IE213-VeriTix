import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api, { getErrorMessage } from '../../services/api';
import { toast } from 'react-toastify';
import { MdConfirmationNumber } from 'react-icons/md';

// Khai báo kiểu dữ liệu (Nên chuyển sang file types sau)
interface Ticket {
  _id: string;
  onChainId: string;
  event: {
    _id: string;
    title: string;
    startDate: string;
    location: string;
    imageUrl: string;
  };
  price: number;
  purchaseDate: string;
  status: 'VALID' | 'USED' | 'CANCELLED';
}

export default function MyTickets() {
  const { walletAddress } = useAuth(); // Lấy trạng thái đăng nhập từ Core của bro
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Nếu chưa đăng nhập -> Đuổi về trang chủ (Hoặc trang Login)
  if (!walletAddress) {
    return <Navigate to="/" replace />;
  }

  // Hàm gọi API lấy vé
  const fetchMyTickets = async () => {
    try {
      setIsLoading(true);
      // Gọi qua Axios instance của bro (đã tự động đính kèm Token trong Header)
      const response = await api.get('/tickets/my-tickets'); 
      setTickets(response.data.data || response.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Lỗi khi tải danh sách vé!');
    } finally {
      setIsLoading(false);
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
        <p className="text-slate-400 mt-2">Quản lý tất cả các vé sự kiện bạn đã mua trên VeriTix</p>
      </div>

      {isLoading ? (
        // Trạng thái Loading
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400">Đang lục tìm ví của bạn...</p>
        </div>
      ) : tickets.length === 0 ? (
        // Trạng thái Không có vé
        <div className="bg-[#0d1117] border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
            <MdConfirmationNumber size={40} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Bạn chưa có vé nào!</h3>
          <p className="text-slate-400 mb-6">Hãy khám phá các sự kiện đang hot và sắm cho mình một tấm vé nhé.</p>
          <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors no-underline">
            Khám phá sự kiện
          </a>
        </div>
      ) : (
        // Trạng thái Có vé (Hiển thị Grid)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-colors group flex flex-col">
              {/* Ảnh bìa sự kiện */}
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={ticket.event?.imageUrl || 'https://via.placeholder.com/400x200'} 
                  alt={ticket.event?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badge trạng thái vé */}
                <div className="absolute top-3 right-3">
                  {ticket.status === 'VALID' && <span className="bg-emerald-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">CHƯA SỬ DỤNG</span>}
                  {ticket.status === 'USED' && <span className="bg-slate-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">ĐÃ CHECK-IN</span>}
                </div>
              </div>

              {/* Thông tin vé */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{ticket.event?.title || 'Sự kiện không xác định'}</h3>
                
                <div className="space-y-2 mt-auto pt-4 border-t border-white/5 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Mã vé On-chain:</span>
                    <span className="font-mono text-blue-400">#{ticket.onChainId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ngày mua:</span>
                    <span>{new Date(ticket.purchaseDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giá đã thanh toán:</span>
                    <span className="text-white font-semibold">{ticket.price.toLocaleString()} VND</span>
                  </div>
                </div>
                
                {/* Nút tải mã QR */}
                <button className="mt-5 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl font-medium transition-colors">
                  Xem mã QR Check-in
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}