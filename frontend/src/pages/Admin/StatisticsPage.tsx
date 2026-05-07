import {
  MOCK_SYSTEM_STATS,
  MOCK_EVENT_STATISTICS,
} from '../../mocks/admin.mock';
import {
  MdPeople,
  MdEventAvailable,
  MdAttachMoney,
  MdLocalActivity,
  MdPerson,
} from 'react-icons/md';

export default function StatisticsPage() {
  const stats = MOCK_SYSTEM_STATS;
  const eventStats = MOCK_EVENT_STATISTICS;

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color = 'text-blue-400',
    bgColor = 'bg-blue-500/10',
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color?: string;
    bgColor?: string;
  }) => (
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Thống kê hệ thống</h1>
        <p className="text-slate-400 text-sm mt-1">Cái nhìn tổng quan về hoạt động của nền tảng</p>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={MdPeople}
          label="Tổng người dùng"
          value={stats.totalUsers}
          color="text-emerald-400"
          bgColor="bg-emerald-500/10"
        />
        <StatCard
          icon={MdPerson}
          label="Ban tổ chức"
          value={stats.totalOrganizers}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
        />
        <StatCard
          icon={MdEventAvailable}
          label="Tổng sự kiện"
          value={stats.totalEvents}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
        />
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={MdEventAvailable}
          label="Sự kiện đang diễn ra"
          value={stats.activeEvents}
          color="text-yellow-400"
          bgColor="bg-yellow-500/10"
        />
        <StatCard
          icon={MdAttachMoney}
          label="Tổng doanh thu"
          value={`${stats.totalRevenue.toFixed(2)} ETH`}
          color="text-emerald-400"
          bgColor="bg-emerald-500/10"
        />
        <StatCard
          icon={MdLocalActivity}
          label="Vé đã bán"
          value={stats.totalTicketsSold}
          color="text-pink-400"
          bgColor="bg-pink-500/10"
        />
        <StatCard
          icon={MdPeople}
          label="Tổng người tham gia"
          value={stats.totalParticipants}
          color="text-cyan-400"
          bgColor="bg-cyan-500/10"
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-6">Doanh thu chi tiết</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
            <div>
              <p className="text-sm font-medium text-white">Tổng doanh thu</p>
              <p className="text-xs text-slate-500 mt-0.5">Từ bán vé sự kiện</p>
            </div>
            <p className="text-xl font-bold text-emerald-400">{stats.totalRevenue.toFixed(2)} ETH</p>
          </div>
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
            <div>
              <p className="text-sm font-medium text-white">Phí nền tảng (5%)</p>
              <p className="text-xs text-slate-500 mt-0.5">Thu được từ tổng doanh thu</p>
            </div>
            <p className="text-xl font-bold text-blue-400">{stats.platformFee.toFixed(2)} ETH</p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm font-medium text-white">Cho nhà tổ chức</p>
              <p className="text-xs text-slate-500 mt-0.5">Sau khi trừ phí (95%)</p>
            </div>
            <p className="text-xl font-bold text-purple-400">
              {(stats.totalRevenue - stats.platformFee).toFixed(2)} ETH
            </p>
          </div>
        </div>
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
                  <td className="px-4 py-3 hidden sm:table-cell text-slate-300">
                    {event.ticketsSold}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-300">
                    {event.participants}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-300">
                    {event.avgTicketPrice.toFixed(3)} ETH
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-emerald-400">{event.revenue.toFixed(2)} ETH</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-16 bg-white/[0.04] rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{
                            width: `${event.occupancyRate}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">
                        {event.occupancyRate.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Distribution */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-6">Phân bố người dùng</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-300">Người dùng</p>
                <p className="text-sm font-semibold text-slate-300">
                  {stats.totalUsers - stats.totalOrganizers}
                </p>
              </div>
              <div className="w-full bg-white/[0.04] rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{
                    width: `${((stats.totalUsers - stats.totalOrganizers) / stats.totalUsers) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-300">Ban tổ chức</p>
                <p className="text-sm font-semibold text-slate-300">
                  {stats.totalOrganizers}
                </p>
              </div>
              <div className="w-full bg-white/[0.04] rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${(stats.totalOrganizers / stats.totalUsers) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Event Status Distribution */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-6">Trạng thái sự kiện</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-300">Đang diễn ra</p>
                <p className="text-sm font-semibold text-slate-300">
                  {stats.activeEvents}
                </p>
              </div>
              <div className="w-full bg-white/[0.04] rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${(stats.activeEvents / stats.totalEvents) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-300">Hoàn tất</p>
                <p className="text-sm font-semibold text-slate-300">
                  {stats.totalEvents - stats.activeEvents}
                </p>
              </div>
              <div className="w-full bg-white/[0.04] rounded-full h-2">
                <div
                  className="bg-slate-500 h-2 rounded-full"
                  style={{
                    width: `${((stats.totalEvents - stats.activeEvents) / stats.totalEvents) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Info */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/[0.08] rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Thống kê tổng quát</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400 mb-1">Trung bình vé bán trên mỗi sự kiện</p>
            <p className="text-lg font-bold text-white">
              {Math.round(stats.totalTicketsSold / stats.totalEvents)}
            </p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Doanh thu trung bình trên mỗi sự kiện</p>
            <p className="text-lg font-bold text-emerald-400">
              {(stats.totalRevenue / stats.totalEvents).toFixed(2)} ETH
            </p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Mật độ người dùng (người/sự kiện)</p>
            <p className="text-lg font-bold text-white">
              {Math.round(stats.totalUsers / stats.totalEvents)}
            </p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Tỷ lệ tham gia (người/vé)</p>
            <p className="text-lg font-bold text-blue-400">
              {(stats.totalParticipants / stats.totalTicketsSold).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
