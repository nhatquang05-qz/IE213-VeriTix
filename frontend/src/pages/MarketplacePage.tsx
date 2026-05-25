import { useState, useEffect } from 'react';
import { MdConfirmationNumber, MdAccessTime, MdLocationOn, MdShoppingCart, MdSearch } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
// import api from '../services/api'; // Mở comment này khi link backend

interface ResellTicket {
  _id: string;
  blockchainTicketId: number;
  purchasePrice: string;
  eventId: {
    _id: string;
    name: string;
    startTime: string;
    location: string;
    bannerUrl: string;
  };
  ownerWallet: string;
}

export default function MarketplacePage() {
  const [tickets, setTickets] = useState<ResellTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Tạm thời dùng Mock Data để hiển thị UI
  // Khi link Backend, sẽ thay bằng hàm gọi API thực tế
  useEffect(() => {
    const loadMarketplace = async () => {
      setIsLoading(true);
      try {
        // const response = await api.get('/tickets/marketplace');
        // setTickets(response.data);
        
        // --- Mock Data ---
        setTimeout(() => {
          setTickets([
            {
              _id: "tk1",
              blockchainTicketId: 105,
              purchasePrice: "1200000",
              ownerWallet: "0x123...abc",
              eventId: {
                _id: "ev1",
                name: "Rap Việt All-Star Concert 2026",
                startTime: new Date(Date.now() + 86400000 * 5).toISOString(),
                location: "SECC, Quận 7, TP.HCM",
                bannerUrl: "https://via.placeholder.com/400x200?text=Rap+Viet"
              }
            },
            {
              _id: "tk2",
              blockchainTicketId: 992,
              purchasePrice: "850000",
              ownerWallet: "0x987...xyz",
              eventId: {
                _id: "ev2",
                name: "Tech Summit - Tương lai AI",
                startTime: new Date(Date.now() + 86400000 * 12).toISOString(),
                location: "Landmark 81, TP.HCM",
                bannerUrl: "https://via.placeholder.com/400x200?text=Tech+Summit"
              }
            }
          ]);
          setIsLoading(false);
        }, 800);
        // -----------------

      } catch (error) {
        toast.error("Không thể tải danh sách vé bán lại");
        setIsLoading(false);
      }
    };
    loadMarketplace();
  }, []);

  const handleBuyTicket = (ticketId: string) => {
    // Logic mua vé sẽ được thực hiện khi gọi smart contract
    toast.info("Chức năng Mua vé đang được kết nối với Blockchain...");
  };

  const filteredTickets = tickets.filter(t => 
    t.eventId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-[vtx-fade_0.4s_ease]">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-4">
            <MdConfirmationNumber className="text-cyan-400" />
            Marketplace
          </h1>
          <p className="text-slate-400 mt-2">
            Thị trường giao dịch vé an toàn và minh bạch. Mua lại vé từ những người không thể tham gia.
          </p>
        </div>
        
        {/* Thanh tìm kiếm */}
        <div className="relative w-full md:w-[350px]">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={22} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sự kiện..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0d1117] border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all" 
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 animate-pulse">Đang đồng bộ dữ liệu từ Blockchain...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-[#0d1117] border border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
            <MdShoppingCart size={48} className="text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Chợ đang trống!</h3>
          <p className="text-slate-400 mb-8">Hiện tại không có ai đăng bán vé nào. Hãy quay lại sau nhé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTickets.map((ticket) => (
            <div key={ticket._id} className="bg-[#161b22] border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/40 transition-all group shadow-xl hover:shadow-[0_10px_40px_rgba(0,212,255,0.15)] flex flex-col">
              
              {/* Banner Image */}
              <Link to={`/events/${ticket.eventId._id}`} className="h-48 relative overflow-hidden block">
                <img 
                  src={ticket.eventId?.bannerUrl} 
                  alt={ticket.eventId?.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-cyan-500/90 backdrop-blur-sm text-white px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg border border-white/20">
                    Đang bán lại
                  </span>
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <Link to={`/events/${ticket.eventId._id}`} className="text-xl font-bold text-white mb-4 line-clamp-2 hover:text-cyan-400 transition-colors">
                  {ticket.eventId?.name}
                </Link>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <MdAccessTime className="text-cyan-400 shrink-0" size={18} />
                    <span>{new Date(ticket.eventId.startTime).toLocaleString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <MdLocationOn className="text-cyan-400 shrink-0" size={18} />
                    <span className="line-clamp-1">{ticket.eventId?.location}</span>
                  </div>
                </div>

                {/* Ticket Info Panel */}
                <div className="bg-black/30 rounded-2xl p-5 border border-white/5 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-slate-500 font-medium">Mã vé (Token ID)</span>
                    <span className="text-cyan-400 font-mono font-bold bg-cyan-500/10 px-2 py-1 rounded">#{ticket.blockchainTicketId}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-slate-500 font-medium">Người bán</span>
                    <span className="text-slate-300 font-mono text-xs">{ticket.ownerWallet.slice(0,6)}...{ticket.ownerWallet.slice(-4)}</span>
                  </div>
                  <div className="h-px bg-white/5 w-full my-3" />
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-slate-400 font-medium">Giá chuyển nhượng</span>
                    <span className="text-2xl text-white font-black">{parseInt(ticket.purchasePrice).toLocaleString()} VND</span>
                  </div>
                </div>
                
                {/* Action Button */}
                <button 
                  onClick={() => handleBuyTicket(ticket._id)}
                  className="w-full bg-[linear-gradient(135deg,#0066ff_0%,#00d4ff_100%)] hover:opacity-90 text-white py-4 rounded-2xl font-bold transition-all shadow-[0_6px_20px_rgba(0,212,255,0.3)] flex items-center justify-center gap-2"
                >
                  <MdShoppingCart size={20} />
                  MUA NGAY
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}