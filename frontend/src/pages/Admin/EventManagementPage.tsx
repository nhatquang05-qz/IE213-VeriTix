import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { AdminEvent } from '../../mocks/admin.mock';
import { MdSearch, MdCheckCircle, MdCancel } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function EventManagementPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'active' | 'ended'>('all');

  const fetchEvents = async () => {
    try {
      const res = await api.get('/admin/events');
      setEvents(res.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách sự kiện');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleApprove = async (eventId: string) => {
    try {
      await api.put(`/admin/events/${eventId}/status`, { status: 'active' });
      toast.success('Đã duyệt sự kiện!');
      fetchEvents();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleReject = async (eventId: string) => {
    if (confirm('Bạn có chắc chắn muốn từ chối sự kiện này?')) {
      try {
        await api.put(`/admin/events/${eventId}/status`, { status: 'rejected' });
        toast.success('Đã từ chối sự kiện!');
        fetchEvents();
      } catch (error) {
        toast.error('Có lỗi xảy ra');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-400/20';
      case 'active': case 'approved': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border border-red-400/20';
      case 'ended': return 'bg-slate-500/10 text-slate-400 border border-slate-400/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-400/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'active': case 'approved': return 'Đã duyệt / Hoạt động';
      case 'rejected': return 'Từ chối / Đã hủy';
      case 'ended': return 'Đã kết thúc';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Quản lý sự kiện</h1>
        <p className="text-slate-400 text-sm mt-1">Duyệt và quản lý các sự kiện trên hệ thống</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="relative sm:col-span-2">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input type="text" placeholder="Tìm kiếm theo tên sự kiện hoặc ban tổ chức..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="active">Hoạt động</option>
          <option value="rejected">Đã hủy</option>
          <option value="ended">Đã kết thúc</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 md:p-6 hover:bg-white/[0.05] transition-all">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{event.name}</h3>
                    <p className="text-slate-400 text-sm">Ban tổ chức: <span className="text-slate-300 font-medium">{event.organizer}</span></p>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-white/[0.04]">
                  <div><p className="text-xs text-slate-500 mb-1">Ngày diễn ra</p><p className="text-sm font-semibold text-white">{event.startDate}</p></div>
                  <div><p className="text-xs text-slate-500 mb-1">Vé đã bán</p><p className="text-sm font-semibold text-white">{event.soldTickets}/{event.maxTickets}</p></div>
                  <div><p className="text-xs text-slate-500 mb-1">Doanh thu</p><p className="text-sm font-semibold text-emerald-400">{event.revenue.toLocaleString()} VND</p></div>
                  <div><p className="text-xs text-slate-500 mb-1">Sức chứa</p><p className="text-sm font-semibold text-white">{event.capacity}</p></div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-2 md:gap-3">
                {event.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(event.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg"><MdCheckCircle size={18} /><span className="hidden sm:inline">Duyệt</span></button>
                    <button onClick={() => handleReject(event.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg"><MdCancel size={18} /><span className="hidden sm:inline">Từ chối</span></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}