import { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdPeople, MdEventAvailable, MdAttachMoney, MdLocalActivity, MdPerson } from 'react-icons/md';

export default function StatisticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [eventStats, setEventStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
        setEventStats(res.data.eventStats);
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color = 'text-blue-400', bgColor = 'bg-blue-500/10' }: any) => (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 md:p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon size={24} className={color} />
        </div>
      </div>
      <p className="text-slate-400 text-sm font-medium mb-2">{label}</p>
      <div className="text-2xl md:text-3xl font-bold text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );

  if (isLoading || !stats) {
    return <div className="text-white text-center py-20">Đang tải dữ liệu thống kê...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Thống kê hệ thống</h1>
        <p className="text-slate-400 text-sm mt-1">Cái nhìn tổng quan về hoạt động của nền tảng</p>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={MdPeople} label="Tổng người dùng" value={stats.totalUsers} color="text-emerald-400" bgColor="bg-emerald-500/10" />
        <StatCard icon={MdPerson} label="Ban tổ chức" value={stats.totalOrganizers} color="text-blue-400" bgColor="bg-blue-500/10" />
        <StatCard icon={MdEventAvailable} label="Tổng sự kiện" value={stats.totalEvents} color="text-purple-400" bgColor="bg-purple-500/10" />
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MdEventAvailable} label="Sự kiện đang diễn ra" value={stats.activeEvents} color="text-yellow-400" bgColor="bg-yellow-500/10" />
        <StatCard icon={MdAttachMoney} label="Tổng doanh thu" value={`${stats.totalRevenue.toLocaleString()} VND`} color="text-emerald-400" bgColor="bg-emerald-500/10" />
        <StatCard icon={MdLocalActivity} label="Vé đã bán" value={stats.totalTicketsSold} color="text-pink-400" bgColor="bg-pink-500/10" />
        <StatCard icon={MdPeople} label="Tổng người tham gia" value={stats.totalParticipants} color="text-cyan-400" bgColor="bg-cyan-500/10" />
      </div>

      {/* Top Events Statistics */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-6">Top 5 sự kiện nổi bật</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.05] border-b border-white/[0.08]">
              <tr>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold">Tên sự kiện</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold hidden sm:table-cell">Vé đã bán</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold hidden md:table-cell">Người tham gia</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold hidden lg:table-cell">Giá trung bình</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold">Doanh thu</th>
                <th className="text-left px-4 py-3 text-slate-400 font-semibold hidden sm:table-cell">Sức chứa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {eventStats.map((event) => (
                <tr key={event.eventId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white truncate">{event.eventName}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-slate-300">{event.ticketsSold}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-300">{event.participants}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-300">{event.avgTicketPrice.toLocaleString()} VND</td>
                  <td className="px-4 py-3"><p className="font-semibold text-emerald-400">{event.revenue.toLocaleString()} VND</p></td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-16 bg-white/[0.04] rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: `${event.occupancyRate}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{event.occupancyRate.toFixed(1)}%</span>
                    </div>
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