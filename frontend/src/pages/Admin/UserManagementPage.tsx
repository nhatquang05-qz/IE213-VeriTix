import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { AdminUser } from '../../mocks/admin.mock';
import { MdSearch } from 'react-icons/md';
import { toast } from 'react-toastify';

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'organizer' | 'admin'>('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (error) {
        toast.error('Lỗi khi tải danh sách người dùng');
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/10 text-purple-400 border border-purple-400/20';
      case 'organizer': return 'bg-blue-500/10 text-blue-400 border border-blue-400/20';
      case 'user': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-400/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Quản lý người dùng</h1>
          <p className="text-slate-400 text-sm mt-1">Quản lý tất cả tài khoản người dùng trên hệ thống</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="relative sm:col-span-2">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input type="text" placeholder="Tìm kiếm theo tên hoặc email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder-slate-500 focus:outline-none" />
        </div>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value as any)} className="px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm">
          <option value="all">Tất cả vai trò</option>
          <option value="user">Người dùng</option>
          <option value="organizer">Ban tổ chức</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.05] border-b border-white/[0.08]">
              <tr>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold">Tên</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold hidden lg:table-cell">Vai trò</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold hidden sm:table-cell">Số Vé Sở Hữu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 md:hidden">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 hidden md:table-cell">{user.email}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 hidden sm:table-cell">
                    <span className="px-2.5 py-1 bg-white/[0.06] rounded-lg text-xs font-semibold">{user.totalTickets}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}