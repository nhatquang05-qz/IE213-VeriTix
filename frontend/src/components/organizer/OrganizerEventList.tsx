import React, { useState } from 'react';

/* ══════════════════════════════════════════
   OrganizerEventList — Danh sách sự kiện
   Veritix Organizer Dashboard
   ══════════════════════════════════════════ */

export type OrganizerEvent = {
  _id: string;
  blockchainId: number;
  name: string;
  status: 'ACTIVE' | 'ENDED' | 'DRAFT' | string;
  maxSupply: number;
  sold: number;
  revenueETH: string;
  bannerUrl?: string;
};

type OrganizerEventListProps = {
  events: OrganizerEvent[];
  loading: boolean;
  error: string;
  compact?: boolean;
};

const STATUS_CFG: Record<string, { label: string; bg: string; color: string }> = {
  ACTIVE: { label: 'Sắp tới', bg: 'rgba(52,211,153,0.12)', color: '#34d399' },
  ENDED: { label: 'Đã qua', bg: 'rgba(148,163,184,0.12)', color: '#94a3b8' },
  DRAFT: { label: 'Nháp', bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
};

/* ── Sub-components ── */

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? {
    label: status,
    bg: 'rgba(100,116,139,0.12)',
    color: '#94a3b8',
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      {cfg.label}
    </span>
  );
};

const ProgressBar: React.FC<{ sold: number; maxSupply: number }> = ({ sold, maxSupply }) => {
  const pct = maxSupply > 0 ? Math.min(100, Math.round((sold / maxSupply) * 100)) : 0;
  return (
    <div
      style={{
        marginTop: 5,
        background: '#1a2235',
        borderRadius: 4,
        height: 4,
        width: '100%',
        minWidth: 80,
      }}
      title={`${pct}% đã bán`}
    >
      <div
        style={{
          height: '100%',
          borderRadius: 4,
          background: '#34d399',
          width: `${pct}%`,
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  );
};

const EventRow: React.FC<{ event: OrganizerEvent; compact?: boolean }> = ({ event, compact }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: compact ? '1fr auto' : '72px 1fr auto',
        gap: compact ? 10 : 14,
        alignItems: 'center',
        padding: compact ? '12px 14px' : '14px 20px',
        borderBottom: '1px solid rgba(99,179,237,0.12)',
        background: hovered ? '#1a2235' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      {/* Thumbnail — ẩn trên mobile */}
      {!compact && (
        <div
          style={{
            width: 72,
            height: 50,
            borderRadius: 8,
            overflow: 'hidden',
            background: '#1a2235',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {event.bannerUrl ? (
            <img
              src={event.bannerUrl}
              alt={event.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center', padding: 4 }}>
              No image
            </span>
          )}
        </div>
      )}

      {/* Info */}
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#f1f5f9',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {event.name}
        </p>
        <div
          style={{
            fontSize: 12,
            color: '#94a3b8',
            marginTop: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <StatusBadge status={event.status} />
          <span>#{event.blockchainId}</span>
          <span>
            {event.sold}/{event.maxSupply} vé
          </span>
        </div>
        <ProgressBar sold={event.sold} maxSupply={event.maxSupply} />
      </div>

      {/* Revenue */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p
          style={{
            fontSize: 11,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Doanh thu
        </p>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#38bdf8', marginTop: 2 }}>
          {parseFloat(event.revenueETH || '0').toFixed(4)}
          <span style={{ fontSize: 11, fontWeight: 400, color: '#94a3b8', marginLeft: 3 }}>
            ETH
          </span>
        </p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════ */
const OrganizerEventList: React.FC<OrganizerEventListProps> = ({
  events,
  loading,
  error,
  compact,
}) => {
  if (loading)
    return (
      <div style={{ padding: '48px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
        <div
          className="vtx-spinner"
          style={{
            width: 28,
            height: 28,
            border: '2.5px solid rgba(99,179,237,0.22)',
            borderTopColor: '#38bdf8',
            borderRadius: '50%',
            margin: '0 auto 12px',
          }}
        />
        Đang tải dữ liệu…
      </div>
    );

  if (error)
    return (
      <div style={{ padding: '48px 20px', textAlign: 'center', color: '#f87171', fontSize: 14 }}>
        ⚠ {error}
      </div>
    );

  if (events.length === 0)
    return (
      <div style={{ padding: '48px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
        Không tìm thấy sự kiện nào.
      </div>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {events.map((ev) => (
        <EventRow key={ev._id} event={ev} compact={compact} />
      ))}
    </div>
  );
};

export default OrganizerEventList;
