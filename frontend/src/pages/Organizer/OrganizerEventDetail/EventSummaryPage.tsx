import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MdGridView, MdAttachMoney, MdTrendingUp } from 'react-icons/md';
import { TbCube3dSphere } from 'react-icons/tb';
import type { EventDetailContext } from '../../../types/organizer.type';

/* ══════════════════════════════════════════
   EventSummaryPage — Trang "Tổng kết"
  
   ══════════════════════════════════════════ */

/* ── SVG Donut Ring (giữ nguyên - data viz) ── */
const DonutRing: React.FC<{
  percent: number;
  color: string;
  size?: number;
}> = ({ percent, color, size = 100 }) => {
  const r = (size - 10) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="8"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-bold"
        fill={color}
      >
        {percent}%
      </text>
    </svg>
  );
};

/* ── RevenueChart (giữ nguyên SVG - data viz) ── */
type TimeFrame = '24h' | '30d';
type ChartPoint = { label: string; revenue: number; tickets: number };

const RevenueChart: React.FC<{ data: ChartPoint[]; timeframe: TimeFrame }> = ({
  data,
  timeframe,
}) => {
  const W = 720;
  const H = 280;
  const PAD = { top: 20, right: 50, bottom: 40, left: 50 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxRevenue = Math.max(1, ...data.map((d) => d.revenue));
  const maxTickets = Math.max(1, ...data.map((d) => d.tickets));

  const step = timeframe === '24h' ? 2 : 3;

  const xAt = (i: number) =>
    PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const yRevAt = (v: number) => PAD.top + innerH - (v / maxRevenue) * innerH;
  const yTickAt = (v: number) => PAD.top + innerH - (v / maxTickets) * innerH;

  const revenuePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yRevAt(d.revenue)}`)
    .join(' ');
  const ticketsPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yTickAt(d.tickets)}`)
    .join(' ');

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full overflow-x-auto -mx-1 px-1">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full min-w-[440px] sm:min-w-[560px] h-auto"
      >
        {gridLines.map((g) => (
          <line
            key={g}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + innerH * g}
            y2={PAD.top + innerH * g}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {gridLines.map((g) => {
          const val = maxRevenue * (1 - g);
          return (
            <text
              key={`yl-${g}`}
              x={PAD.left - 8}
              y={PAD.top + innerH * g + 4}
              fontSize="10"
              textAnchor="end"
              fill="#64748b"
              fontFamily="monospace"
            >
              {val.toFixed(val < 1 ? 2 : 0)}
            </text>
          );
        })}

        {gridLines.map((g) => {
          const val = maxTickets * (1 - g);
          return (
            <text
              key={`yr-${g}`}
              x={W - PAD.right + 8}
              y={PAD.top + innerH * g + 4}
              fontSize="10"
              textAnchor="start"
              fill="#64748b"
              fontFamily="monospace"
            >
              {Math.round(val)}
            </text>
          );
        })}

        {data.map((d, i) =>
          i % step === 0 ? (
            <text
              key={i}
              x={xAt(i)}
              y={H - PAD.bottom + 18}
              fontSize="10"
              textAnchor="middle"
              fill="#64748b"
            >
              {d.label}
            </text>
          ) : null
        )}

        <text
          x={14}
          y={PAD.top + innerH / 2}
          fontSize="10"
          textAnchor="middle"
          fill="#94a3b8"
          transform={`rotate(-90, 14, ${PAD.top + innerH / 2})`}
        >
          Doanh thu
        </text>
        <text
          x={W - 14}
          y={PAD.top + innerH / 2}
          fontSize="10"
          textAnchor="middle"
          fill="#94a3b8"
          transform={`rotate(90, ${W - 14}, ${PAD.top + innerH / 2})`}
        >
          Số vé bán
        </text>

        <path
          d={revenuePath}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={ticketsPath}
          fill="none"
          stroke="#34d399"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => (
          <g key={`p-${i}`}>
            <circle cx={xAt(i)} cy={yRevAt(d.revenue)} r="3" fill="#a78bfa" />
            <circle cx={xAt(i)} cy={yTickAt(d.tickets)} r="3" fill="#34d399" />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default function EventSummaryPage() {
  const { event } = useOutletContext<EventDetailContext>();
  const [timeframe, setTimeframe] = useState<TimeFrame>('24h');

  const chartData: ChartPoint[] = useMemo(() => {
    if (!event) return [];
    const price = parseFloat(event.price || '0');
    if (timeframe === '24h') {
      return Array.from({ length: 22 }, (_, i) => ({
        label: `${i.toString().padStart(2, '0')}:00`,
        revenue: 0,
        tickets: 0,
      }));
    }
    return Array.from({ length: 30 }, (_, i) => ({
      label: `${i + 1}`,
      revenue: 0 * price,
      tickets: 0,
    }));
  }, [timeframe, event]);

  if (!event) return null;

  const ticketsSold = event.currentMinted;
  const maxSupply = event.maxSupply;
  const ticketPercent = maxSupply > 0 ? Math.round((ticketsSold / maxSupply) * 100) : 0;
  const price = parseFloat(event.price || '0');
  const revenueETH = ticketsSold * price;

  // Stat cards - đã swap sang react-icons
  const stats = [
    {
      label: 'Tổng vé phát hành',
      value: maxSupply.toLocaleString('vi-VN'),
      icon: <MdGridView size={16} />,
      color: 'text-violet-400',
      bg: 'bg-violet-500/[0.08]',
    },
    {
      label: 'Giá vé',
      value: `Ξ ${event.price}`,
      icon: <MdAttachMoney size={18} />,
      color: 'text-sky-400',
      bg: 'bg-sky-500/[0.08]',
    },
    {
      label: 'Phí bán lại',
      value: `${event.maxResellPercentage}%`,
      icon: <MdTrendingUp size={16} />,
      color: 'text-amber-400',
      bg: 'bg-amber-500/[0.08]',
    },
    {
      label: 'Blockchain',
      value: event.isOnChain ? 'Verified' : 'Pending',
      icon: <TbCube3dSphere size={16} />,
      color: event.isOnChain ? 'text-emerald-400' : 'text-slate-500',
      bg: event.isOnChain ? 'bg-emerald-500/[0.08]' : 'bg-slate-500/[0.06]',
    },
  ];

  const ticketRows = [
    {
      type: 'Vé tiêu chuẩn',
      price,
      sold: ticketsSold,
      total: maxSupply,
      locked: 0,
    },
  ];

  return (
    <div className="max-w-[960px] mx-auto animate-[vtx-fade_0.35s_ease]">
      {/* ══════ Section 1: Doanh thu ══════ */}
      <h2 className="text-base sm:text-lg font-bold text-white mb-4">Doanh thu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6">
        <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-white/[0.1] transition-colors">
          <div className="min-w-0">
            <p className="text-[12px] sm:text-[13px] text-slate-500 mb-1">Doanh thu</p>
            <p className="text-xl sm:text-2xl font-bold text-white font-mono truncate">
              Ξ {revenueETH.toFixed(4)}
            </p>
            <p className="text-[11.5px] sm:text-[12px] text-slate-600 mt-1 truncate">
              Tổng: Ξ {(maxSupply * price).toFixed(4)}
            </p>
          </div>
          <DonutRing percent={ticketPercent} color="#eab308" size={84} />
        </div>

        <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 hover:border-white/[0.1] transition-colors">
          <div className="min-w-0">
            <p className="text-[12px] sm:text-[13px] text-slate-500 mb-1">Số vé đã bán</p>
            <p className="text-xl sm:text-2xl font-bold text-white font-mono">
              {ticketsSold.toLocaleString('vi-VN')}
              <span className="text-sm sm:text-base text-slate-600 font-normal ml-1">vé</span>
            </p>
            <p className="text-[11.5px] sm:text-[12px] text-slate-600 mt-1">
              Tổng: {maxSupply.toLocaleString('vi-VN')} vé
            </p>
          </div>
          <DonutRing percent={ticketPercent} color="#f59e0b" size={84} />
        </div>
      </div>

      {/* ══════ Section 2: Biểu đồ ══════ */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-4 sm:p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
            <span className="flex items-center gap-2 text-[12.5px] sm:text-[13px] font-semibold text-slate-200">
              <span className="w-3 h-3 rounded-full bg-violet-400 inline-block" />
              Doanh thu
            </span>
            <span className="flex items-center gap-2 text-[12.5px] sm:text-[13px] font-semibold text-slate-200">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              Số vé bán
            </span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#080b14] border border-white/[0.06] rounded-full self-start sm:self-auto">
            {(['24h', '30d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`
                  px-3 sm:px-4 py-1.5 rounded-full text-[11.5px] sm:text-[12px] font-semibold cursor-pointer transition-all
                  ${
                    timeframe === tf
                      ? 'bg-emerald-500 text-white shadow-[0_2px_8px_rgba(16,185,129,0.3)]'
                      : 'text-slate-500 hover:text-slate-300'
                  }
                `}
              >
                {tf === '24h' ? '24 giờ' : '30 ngày'}
              </button>
            ))}
          </div>
        </div>

        <RevenueChart data={chartData} timeframe={timeframe} />
      </div>

      {/* ══════ Section 3: "Vé đã bán" - RESPONSIVE ══════ */}
      <h3 className="text-[14px] sm:text-[15px] font-bold text-white mb-3">Vé đã bán</h3>

      {/* Desktop: Table */}
      <div className="hidden md:block bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-x-auto mb-6">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Loại vé', 'Giá bán', 'Đã bán', 'Bị khoá', 'Tỉ lệ bán'].map((h) => (
                <th
                  key={h}
                  className="text-left text-[12px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ticketRows.map((row) => {
              const percent = row.total > 0 ? Math.round((row.sold / row.total) * 100) : 0;
              return (
                <tr
                  key={row.type}
                  className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4 text-[13px] font-medium text-slate-200">{row.type}</td>
                  <td className="px-5 py-4 text-[13px] text-slate-400 font-mono">
                    Ξ {row.price.toFixed(4)}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-slate-400 font-mono">
                    {row.sold} / {row.total}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-slate-400 font-mono">{row.locked}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 min-w-[160px]">
                      <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-amber-400 font-mono w-10 text-right">
                        {percent}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card stack */}
      <div className="md:hidden flex flex-col gap-2.5 mb-6">
        {ticketRows.map((row) => {
          const percent = row.total > 0 ? Math.round((row.sold / row.total) * 100) : 0;
          return (
            <div key={row.type} className="bg-[#0d1117] border border-white/[0.06] rounded-xl p-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-200 truncate">{row.type}</p>
                  <p className="text-[11.5px] text-slate-500 font-mono mt-0.5">
                    Ξ {row.price.toFixed(4)}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] text-amber-400 font-mono font-semibold">
                  {percent}%
                </span>
              </div>

              {/* Data grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-[10.5px] text-slate-600 uppercase tracking-wider mb-0.5">
                    Đã bán
                  </p>
                  <p className="text-[12.5px] text-slate-300 font-mono font-semibold">
                    {row.sold}/{row.total}
                  </p>
                </div>
                <div>
                  <p className="text-[10.5px] text-slate-600 uppercase tracking-wider mb-0.5">
                    Bị khoá
                  </p>
                  <p className="text-[12.5px] text-slate-300 font-mono font-semibold">
                    {row.locked}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════ Section 4: Chi tiết (stats) ══════ */}
      <h2 className="text-base sm:text-lg font-bold text-white mb-4">Chi tiết</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-[#0d1117] border border-white/[0.06] rounded-xl p-3 md:p-4 hover:border-white/[0.1] transition-colors"
          >
            <div
              className={`${s.color} ${s.bg} w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 md:mb-3`}
            >
              {s.icon}
            </div>
            <p className="text-[10.5px] md:text-[11px] text-slate-600 uppercase tracking-wider mb-1">
              {s.label}
            </p>
            <p className="text-[14px] md:text-[15px] font-bold text-white font-mono truncate">
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
