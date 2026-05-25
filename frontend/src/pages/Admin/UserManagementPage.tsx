import { useState } from 'react';
import { MOCK_ADMIN_USERS } from '../../mocks/admin.mock';
import type { AdminUser } from '../../mocks/admin.mock';
import { MdAdd, MdSearch, MdEdit, MdDelete } from 'react-icons/md';

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'organizer' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'inactive'>('all');

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === 'all' || user.role === filterRole;
    const matchStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const handleAddUser = () => {
    alert('Chức năng thêm tài khoản sẽ được nối API sau.');
  };

  const handleEditUser = (user: AdminUser) => {
    alert(`Chức năng chỉnh sửa tài khoản ${user.name} sẽ được nối API sau.`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleStatusChange = (userId: string, newStatus: AdminUser['status']) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/10 text-purple-400 border border-purple-400/20';
      case 'organizer':
        return 'bg-blue-500/10 text-blue-400 border border-blue-400/20';
      case 'user':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20';
      case 'suspended':
        return 'bg-red-500/10 text-red-400 border border-red-400/20';
      case 'inactive':
        return 'bg-slate-500/10 text-slate-400 border border-slate-400/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Quản lý người dùng</h1>
          <p className="text-slate-400 text-sm mt-1">Quản lý tất cả tài khoản người dùng trên hệ thống</p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg transition-all"
        >
          <MdAdd size={18} />
          <span className="hidden sm:inline">Thêm người dùng</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        {/* Role Filter */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as any)}
          className="px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="user">Người dùng</option>
          <option value="organizer">Ban tổ chức</option>
          <option value="admin">Admin</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="suspended">Bị khóa</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.05] border-b border-white/[0.08]">
              <tr>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold">Tên</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold hidden lg:table-cell">Vai trò</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold">Trạng thái</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold hidden sm:table-cell">Vé</th>
                <th className="text-center px-4 py-3 text-slate-400 font-semibold">Hành động</th>
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
                  <td className="px-4 py-3 text-slate-300 hidden md:table-cell">
                    <p className="truncate">{user.email}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                      {user.role === 'user' && 'Người dùng'}
                      {user.role === 'organizer' && 'Ban tổ chức'}
                      {user.role === 'admin' && 'Admin'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value as AdminUser['status'])}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 ${getStatusColor(user.status)} cursor-pointer transition-all`}
                    >
                      <option value="active">Hoạt động</option>
                      <option value="suspended">Bị khóa</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-300 hidden sm:table-cell">
                    <span className="px-2.5 py-1 bg-white/[0.06] rounded-lg text-xs font-semibold">
                      {user.totalTickets}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Chỉnh sửa"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Xóa"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MdSearch size={40} className="text-slate-600 mb-3" />
            <p className="text-slate-400">Không tìm thấy người dùng nào</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4">
          <p className="text-slate-400 text-sm font-medium mb-1">Tổng người dùng</p>
          <p className="text-2xl md:text-3xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4">
          <p className="text-slate-400 text-sm font-medium mb-1">Ban tổ chức</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-400">{users.filter((u) => u.role === 'organizer').length}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4">
          <p className="text-slate-400 text-sm font-medium mb-1">Hoạt động</p>
          <p className="text-2xl md:text-3xl font-bold text-emerald-400">{users.filter((u) => u.status === 'active').length}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4">
          <p className="text-slate-400 text-sm font-medium mb-1">Bị khóa</p>
          <p className="text-2xl md:text-3xl font-bold text-red-400">{users.filter((u) => u.status === 'suspended').length}</p>
        </div>
      </div>
    </div>
  );
}
