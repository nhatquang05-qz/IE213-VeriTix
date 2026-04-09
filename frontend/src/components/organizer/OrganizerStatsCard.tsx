import React from 'react';

/* ══════════════════════════════════════════
   OrganizerStatsCard — Thẻ thống kê
   Veritix Organizer Dashboard
   ══════════════════════════════════════════ */

type Tone = 'cyan' | 'green' | 'purple';

type OrganizerStatsCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  tone?: Tone;
};

const toneMap: Record<Tone, { accent: string; color: string }> = {
  cyan: { accent: 'rgba(56,189,248,0.08)', color: '#38bdf8' },
  green: { accent: 'rgba(52,211,153,0.08)', color: '#34d399' },
  purple: { accent: 'rgba(167,139,250,0.08)', color: '#a78bfa' },
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
      style={{
        background: '#111827',
        border: '1px solid rgba(99,179,237,0.12)',
        borderRadius: 12,
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${t.accent}, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: '#94a3b8',
          position: 'relative',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 28,
          fontWeight: 700,
          marginTop: 6,
          lineHeight: 1.1,
          color: t.color,
          position: 'relative',
        }}
      >
        {value}
      </p>
      {unit && (
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, position: 'relative' }}>{unit}</p>
      )}
    </div>
  );
};

export default OrganizerStatsCard;
