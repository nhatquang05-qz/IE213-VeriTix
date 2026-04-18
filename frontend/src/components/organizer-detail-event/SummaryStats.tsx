import React from 'react';
import type { IEventFull } from '../../types/organizer.type';

/* ══════════════════════════════════════════
   SummaryStats — Grid 4 ô thống kê chi tiết
   Dùng trong EventSummaryPage
   ══════════════════════════════════════════ */

type SummaryStatsProps = {
  event: IEventFull;
};

const SummaryStats: React.FC<SummaryStatsProps> = ({ event }) => {
  const stats = [
    {
      label: 'Tổng vé phát hành',
      value: event.maxSupply.toLocaleString('vi-VN'),
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <rect x="1" y="1" width="9" height="9" rx="1.5" />
          <rect x="14" y="1" width="9" height="9" rx="1.5" />
          <rect x="1" y="14" width="9" height="9" rx="1.5" />
          <rect x="14" y="14" width="9" height="9" rx="1.5" />
        </svg>
      ),
      color: 'text-violet-400',
      bg: 'bg-violet-500/[0.08]',
    },
    {
      label: 'Giá vé',
      value: `Ξ ${event.price}`,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      color: 'text-sky-400',
      bg: 'bg-sky-500/[0.08]',
    },
    {
      label: 'Phí bán lại',
      value: `${event.maxResellPercentage}%`,
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
      color: 'text-amber-400',
      bg: 'bg-amber-500/[0.08]',
    },
    {
      label: 'Blockchain',
      value: event.isOnChain ? 'Verified' : 'Pending',
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      color: event.isOnChain ? 'text-emerald-400' : 'text-slate-500',
      bg: event.isOnChain ? 'bg-emerald-500/[0.08]' : 'bg-slate-500/[0.06]',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="
            bg-[#0d1117] border border-white/[0.06] rounded-xl p-4
            hover:border-white/[0.1] transition-colors
          "
        >
          <div
            className={`${s.color} ${s.bg} w-8 h-8 rounded-lg flex items-center justify-center mb-3`}
          >
            {s.icon}
          </div>
          <p className="text-[11px] text-slate-600 uppercase tracking-wider mb-1">{s.label}</p>
          <p className="text-[15px] font-bold text-white font-mono truncate">{s.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryStats;
