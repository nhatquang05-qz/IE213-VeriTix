import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { MdConfirmationNumber, MdClose, MdAccessTime, MdLocationOn } from 'react-icons/md';
import { QRCodeSVG } from 'qrcode.react';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config/contract';
import { getEthToVndRate } from '../../services/currency.service';

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

  // States cho tính năng Bán lại (Resell)
  const [resellModal, setResellModal] = useState<{ isOpen: boolean; ticket: Ticket | null }>({ isOpen: false, ticket: null });
  const [resellPriceVnd, setResellPriceVnd] = useState('');
  const [resellPriceEth, setResellPriceEth] = useState('');
  const [isReselling, setIsReselling] = useState(false);
  const [ethRate, setEthRate] = useState<number>(0);

  useEffect(() => {
    const fetchRate = async () => {
      const rate = await getEthToVndRate();
      setEthRate(rate);
    };
    fetchRate();
  }, []);

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
      
      const d = new Date(ticket.eventId.startTime);
      const pad = (n: number) => n.toString().padStart(2, '0');
      
      const eventTime = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} ${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()} UTC`;

      const message = `VERITIX CHECK-IN\nSự kiện: ${ticket.eventId.name}\nThời gian: ${eventTime}\nID Vé: #${ticket.blockchainTicketId}\nTimestamp: ${timestamp}`.normalize('NFC');

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

  const handleOpenResellModal = (ticket: Ticket) => {
    setResellModal({ isOpen: true, ticket });
    setResellPriceVnd('');
    setResellPriceEth('');
  };

  const handleVndPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vnd = e.target.value;
    setResellPriceVnd(vnd);
    
    if (vnd && !isNaN(Number(vnd)) && ethRate > 0) {
      const ethValue = Number(vnd) / ethRate;
      setResellPriceEth(ethValue.toFixed(18).replace(/\.?0+$/, ''));
    } else {
      setResellPriceEth('');
    }
  };

  const handleListResell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resellModal.ticket || !resellPriceVnd || !resellPriceEth) return;

    // Kiểm tra giới hạn giá (95% giá gốc)
    const maxAllowedVnd = Number(resellModal.ticket.purchasePrice) * 0.95;
    if (Number(resellPriceVnd) > maxAllowedVnd) {
      toast.error(`Giá bán lại không được vượt quá 95% giá gốc (${maxAllowedVnd.toLocaleString('vi-VN')} VND)!`);
      return;
    }

    try {
      setIsReselling(true);
      if (!window.ethereum) throw new Error("Vui lòng cài đặt ví MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // 1. Tương tác với Smart Contract để list vé
      const tx = await contract.listTicket(resellModal.ticket.blockchainTicketId, ethers.parseEther(resellPriceEth));
      await tx.wait();

      // 2. Cập nhật trạng thái trên Backend (MongoDB)
      await api.post(`/tickets/${resellModal.ticket._id}/resell`, { price: resellPriceVnd });

      toast.success('Đã niêm yết vé lên Marketplace thành công!');
      setResellModal({ isOpen: false, ticket: null });
      setResellPriceVnd('');
      setResellPriceEth('');
      fetchMyTickets();
    } catch (error: any) {
      const errStr = JSON.stringify(error, Object.getOwnPropertyNames(error));
      if (errStr.includes('VeriTix__PriceExceedsMax')) {
        toast.error('Lỗi Web3: Smart Contract từ chối vì giá niêm yết vượt mức tối đa.');
      } else if (errStr.includes('0x7e273289')) {
        toast.error('Lỗi Web3: Vé không tồn tại trên Blockchain (Dữ liệu DB và chuỗi bị lệch). Vui lòng mua vé mới để đồng bộ!');
      } else {
        toast.error(error.message || 'Lỗi khi bán lại vé. Vui lòng kiểm tra lại!');
      }
    } finally {
      setIsReselling(false);
    }
  };

  const handleCancelResell = async (ticketId: string) => {
    try {
      await api.post(`/tickets/${ticketId}/cancel-resell`);
      toast.success('Đã hủy bán lại vé!');
      fetchMyTickets();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi hủy bán lại vé');
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
                  {ticket.status === 'RESELLING' && (
                    <span className="bg-yellow-500 text-white px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                      Đang Bán Lại
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
                    <span className="text-slate-500">{ticket.status === 'RESELLING' ? 'Giá đang niêm yết:' : 'Giá thanh toán:'}</span>
                    <span className="text-white font-bold">{parseInt(ticket.purchasePrice).toLocaleString()} VND</span>
                  </div>
                </div>
                
                {ticket.status === 'SOLD' ? (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => handleGenerateQR(ticket)}
                      disabled={isSigning === ticket._id}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSigning === ticket._id ? 'Đang chờ ký xác nhận...' : 'HIỂN THỊ MÃ QR'}
                    </button>
                    <button 
                      onClick={() => handleOpenResellModal(ticket)}
                      className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-3.5 rounded-2xl font-bold transition-all shadow-lg"
                    >
                      BÁN LẠI TỚI MARKETPLACE
                    </button>
                  </div>
                ) : ticket.status === 'RESELLING' ? (
                  <div className="flex flex-col gap-3">
                    <button 
                      disabled
                      className="w-full bg-yellow-600/20 text-yellow-500 py-3.5 rounded-2xl font-bold cursor-not-allowed border border-yellow-500/20"
                    >
                      ĐANG BÁN TRÊN MARKETPLACE
                    </button>
                    <button 
                      onClick={() => handleCancelResell(ticket._id)}
                      className="w-full bg-red-600/20 hover:bg-red-600/40 border border-red-500/20 text-red-500 py-3.5 rounded-2xl font-bold transition-all shadow-lg"
                    >
                      HỦY BÁN LẠI
                    </button>
                  </div>
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

      {/* Modal Bán Lại Vé */}
      {resellModal.isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
          <div className="bg-[#0d1117] border border-white/10 rounded-[32px] p-8 max-w-md w-full relative shadow-2xl animate-[vtx-fade_0.3s_ease]">
            <button
              onClick={() => setResellModal({ isOpen: false, ticket: null })}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <MdClose size={28} />
            </button>
            
            <h2 className="text-2xl font-black text-white mb-2">Bán lại vé</h2>
            <p className="text-slate-400 text-sm mb-6">Thiết lập giá để niêm yết vé của bạn lên Marketplace.</p>
            
            <form onSubmit={handleListResell} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Giá hiển thị (VND)</label>
                <input
                  type="number"
                  required
                  min="10000"
                  step="10000"
                  value={resellPriceVnd}
                  onChange={handleVndPriceChange}
                  className="w-full bg-[#161b22] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Tối thiểu 10,000 VND"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Giá Smart Contract (ETH/MATIC)</label>
                <input
                  type="text"
                  readOnly
                  value={resellPriceEth ? `${resellPriceEth} ETH` : ''}
                  className="w-full bg-[#161b22]/50 border border-white/5 rounded-xl px-4 py-3.5 text-slate-400 cursor-not-allowed"
                  placeholder="Tự động quy đổi..."
                />
                
                {/* HIỂN THỊ LIMIT DỰA TRÊN 95% GIÁ GỐC */}
                {resellModal.ticket && (
                  <p className="text-[13px] text-yellow-500 mt-2 font-medium">
                    * Giới hạn giá tối đa (95% giá gốc): {(Number(resellModal.ticket.purchasePrice) * 0.95).toLocaleString('vi-VN')} VND
                  </p>
                )}
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mt-4">
                <p className="text-xs text-blue-300 leading-relaxed">
                  Lưu ý: Vé sẽ bị khóa vào Smart Contract cho đến khi có người mua hoặc bạn hủy bán. Nền tảng sẽ thu phí bản quyền (5%) dựa trên giá trị giao dịch thành công.
                </p>
              </div>

              <button
                type="submit"
                disabled={isReselling}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-50 mt-2 shadow-lg shadow-blue-900/20"
              >
                {isReselling ? 'Đang xử lý giao dịch Web3...' : 'XÁC NHẬN BÁN LẠI'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}