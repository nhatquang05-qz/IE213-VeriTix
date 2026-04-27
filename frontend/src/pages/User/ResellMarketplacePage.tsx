import { useState, useEffect } from 'react';
import { MdStorefront, MdConfirmationNumber } from 'react-icons/md';

// Mock data tạm để bạn test UI, sau này thay bằng API thực tế
const MOCK_RESELL_TICKETS = [
  {
    _id: '1',
    blockchainTicketId: 105,
    sellerAddress: '0x1234...abcd',
    originalPrice: 1000000,
    resellPrice: 850000,
    event: { name: 'SpaceSpeakers Live Concert', bannerUrl: 'https://via.placeholder.com/400x200', startTime: '2026-05-20T19:00:00.000Z' }
  },
  {
    _id: '2',
    blockchainTicketId: 211,
    sellerAddress: '0x9999...1234',
    originalPrice: 500000,
    resellPrice: 400000,
    event: { name: 'Hội thảo Công nghệ Web3', bannerUrl: 'https://via.placeholder.com/400x200', startTime: '2026-06-15T08:00:00.000Z' }
  }
];

export default function ResellMarketplacePage() {
  const [tickets, setTickets] = useState(MOCK_RESELL_TICKETS);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-[vtx-fade_0.4s_ease]">
      <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <MdStorefront className="text-purple-500" />
            Chợ Vé Resell
          </h1>
          <p className="text-slate-400 mt-2">Săn vé rẻ hơn từ những người dùng khác nhượng lại</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-4">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="bg-[#111827] border border-purple-500/20 hover:border-purple-500/50 rounded-2xl overflow-hidden group flex flex-col transition-colors">
            <div className="h-44 overflow-hidden relative">
              <img 
                src={ticket.event.bannerUrl} 
                alt={ticket.event.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 text-[11px] font-mono rounded-lg border border-white/10">
                Người bán: {ticket.sellerAddress}
              </div>
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#111827] to-transparent h-16"></div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-2">{ticket.event.name}</h3>
              
              <div className="space-y-2 mt-auto pt-4 border-t border-white/5 text-sm">
                <div className="flex justify-between text-slate-400 line-through">
                  <span>Giá gốc:</span>
                  <span>{ticket.originalPrice.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Giá nhượng:</span>
                  <span className="text-purple-400">{ticket.resellPrice.toLocaleString()} VND</span>
                </div>
              </div>
              
              <button 
                className="mt-5 w-full bg-[linear-gradient(135deg,rgba(168,85,247,0.2),rgba(217,70,239,0.1))] hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
              >
                <MdConfirmationNumber size={18} />
                Mua Ngay
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}