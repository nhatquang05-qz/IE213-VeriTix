import React from 'react';

/* ══════════════════════════════════════════
   OrganizerStatsCard — Thẻ thống kê
   ══════════════════════════════════════════ */

type Tone = 'cyan' | 'green' | 'purple';

type OrganizerStatsCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  tone?: Tone;
};

const toneMap: Record<Tone, { gradient: string; textColor: string }> = {
  cyan: {
    gradient: 'from-[rgba(56,189,248,0.08)]',
    textColor: 'text-[#38bdf8]',
  },
  green: {
    gradient: 'from-[rgba(52,211,153,0.08)]',
    textColor: 'text-[#34d399]',
  },
  purple: {
    gradient: 'from-[rgba(167,139,250,0.08)]',
    textColor: 'text-[#a78bfa]',
  },
};

const OrganizerStatsCard: React.FC<OrganizerStatsCardProps> = ({
  label,
  value,
  unit,
  tone = 'cyan',
}) => {
  const t = toneMap[tone];

  return (
    <div
      className={`
        relative overflow-hidden rounded-[12px]
        border border-[rgba(99,179,237,0.12)] bg-[#111827]
        bg-gradient-to-br ${t.gradient} via-transparent to-transparent via-60%
        px-[20px] py-[18px]
      `}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#94a3b8] relative z-[1]">
        {label}
      </p>
      <p className={`mt-[6px] text-[28px] font-bold leading-[1.1] relative z-[1] ${t.textColor}`}>
        {value}
      </p>
      {unit && <p className="mt-[4px] text-[11px] text-[#94a3b8] relative z-[1]">{unit}</p>}
    </div>
  );
};

export default OrganizerStatsCard;
