import { useState, useEffect } from 'react';
import { MdAdd, MdSearch, MdFilterList, MdMoreVert } from 'react-icons/md';
import { useOutletContext } from 'react-router-dom';
import AddMemberModal, { type UserSearchResult } from '../../../components/organizer-detail-event/AddMemberModal';
import type { EventDetailContext } from '../../../types/organizer.type';
import api from '../../../services/api';
import { toast } from 'react-toastify';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'active' | 'pending' | 'inactive';
  addedAt: string;
}

export default function EventMembersPage() {
  const { event } = useOutletContext<EventDetailContext>();
  
  const [members, setMembers] = useState<Member[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Lấy danh sách nhân viên từ DB
  const fetchStaffs = async () => {
    if (!event) return;
    try {
      setIsLoading(true);
      const res = await api.get(`/events/${event._id}/staff`);
      
      const mappedMembers = res.data.map((item: any) => ({
        id: item.user._id,
        name: item.user.fullName || item.user.username,
        email: item.user.walletAddress || `@${item.user.username}`,
        role: item.role,
        status: 'active',
        addedAt: item.addedAt || new Date().toISOString()
      }));
      
      setMembers(mappedMembers);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách nhân viên');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [event?._id]);

  const handleAddMember = async (user: UserSearchResult, role: 'admin' | 'staff') => {
    if (!event) return;
    
    try {
      // GỌI API LƯU VÀO DATABASE
      await api.post(`/events/${event._id}/staff`, {
        userId: user._id,
        role: role
      });
      
      toast.success(`Đã thêm ${user.displayName || user.username} vào sự kiện!`);
      fetchStaffs(); // Tải lại danh sách
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi thêm nhân viên');
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1180px] mx-auto animate-[vtx-fade_0.35s_ease]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">Quản lý thành viên</h2>
          <p className="text-[13px] text-slate-400 mt-1">Phân quyền cho đội ngũ quản lý và soát vé sự kiện</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-emerald-400 transition-all shadow-[0_2px_12px_rgba(16,185,129,0.25)]"
        >
          <MdAdd size={18} /> Thêm thành viên
        </button>
      </div>

      <div className="rounded-3xl border border-white/[0.08] bg-[#0b1020] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <MdSearch size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc ví..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050814] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-slate-600 focus:border-blue-500/40 outline-none"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-white/[0.08] text-slate-400 hover:bg-white/[0.04] transition-colors"><MdFilterList size={18} /></button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 text-center text-slate-500 text-sm">Đang tải dữ liệu...</div>
          ) : filteredMembers.length === 0 ? (
             <div className="p-10 text-center text-slate-500 text-sm">Chưa có nhân viên nào trong sự kiện này.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.01]">
                  <th className="px-5 py-3.5 text-[12px] font-medium text-slate-500 w-[40%]">Thành viên</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-slate-500 w-[20%]">Vai trò</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-slate-500 w-[25%]">Ngày thêm</th>
                  <th className="px-5 py-3.5 text-[12px] font-medium text-slate-500 w-[15%] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.01] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-500/[0.1] border border-blue-500/20 flex items-center justify-center shrink-0">
                          <span className="text-[13px] font-bold text-blue-400">{member.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-slate-200 truncate">{member.name}</p>
                          <p className="text-[12px] text-slate-500 truncate font-mono">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        member.role === 'admin' ? 'bg-amber-500/[0.1] text-amber-400' : 'bg-emerald-500/[0.1] text-emerald-400'
                      }`}>
                        {member.role === 'admin' ? 'Quản trị viên' : 'Nhân viên soát vé'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-slate-400">
                      {new Date(member.addedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors">
                        <MdMoreVert size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddMemberModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
      />
    </div>
  );
}