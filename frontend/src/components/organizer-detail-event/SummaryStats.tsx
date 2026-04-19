import React from 'react';
import { MdGridView, MdAttachMoney, MdTrendingUp } from 'react-icons/md';
import { TbCube3dSphere } from 'react-icons/tb';
import type { IEventFull } from '../../types/organizer.type';

/* ══════════════════════════════════════════
   SummaryStats — Grid 4 ô thống kê
   ══════════════════════════════════════════ */

type SummaryStatsProps = {
  event: IEventFull;
};

const SummaryStats: React.FC<SummaryStatsProps> = ({ event }) => {
  const stats = [
    {
      label: 'Tổng vé phát hành',
      value: event.maxSupply.toLocaleString('vi-VN'),
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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="
            bg-[#0d1117] border border-white/[0.06] rounded-xl p-3 md:p-4
            hover:border-white/[0.1] transition-colors
          "
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
  );
};

export default SummaryStats;
