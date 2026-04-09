import React from 'react';

/* ══════════════════════════════════════════
   OrganizerEventList — Danh sách sự kiện
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
  compact?: boolean; // true trên mobile — ẩn thumbnail, thu gọn padding
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  ACTIVE: { label: 'Sắp tới', bg: 'bg-[rgba(52,211,153,0.12)]', text: 'text-[#34d399]' },
  ENDED: { label: 'Đã qua', bg: 'bg-[rgba(148,163,184,0.12)]', text: 'text-[#94a3b8]' },
  DRAFT: { label: 'Nháp', bg: 'bg-[rgba(251,191,36,0.12)]', text: 'text-[#fbbf24]' },
};

/* ── Sub-components ── */

const Spinner: React.FC = () => (
  <div className="py-[48px] px-[20px] text-center text-[14px] text-[#94a3b8]">
    <div className="mx-auto mb-[12px] w-[28px] h-[28px] rounded-full border-[2.5px] border-[rgba(99,179,237,0.22)] border-t-[#38bdf8] animate-spin" />
    Đang tải dữ liệu…
  </div>
);

const EmptyState: React.FC<{ message: string; isError?: boolean }> = ({ message, isError }) => (
  <div
    className={`py-[48px] px-[20px] text-center text-[14px] ${isError ? 'text-[#f87171]' : 'text-[#94a3b8]'}`}
  >
    {isError && '⚠ '}
    {message}
  </div>
);

const EventThumbnail: React.FC<{ bannerUrl?: string; name: string }> = ({ bannerUrl, name }) => (
  <div className="w-[72px] h-[50px] shrink-0 overflow-hidden rounded-[8px] bg-[#1a2235] flex items-center justify-center">
    {bannerUrl ? (
      <img src={bannerUrl} alt={name} className="w-full h-full object-cover" />
    ) : (
      <span className="text-[10px] text-[#94a3b8] text-center p-[4px]">No image</span>
    )}
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    bg: 'bg-[rgba(100,116,139,0.12)]',
    text: 'text-[#94a3b8]',
  };
  return (
    <span
      className={`inline-flex items-center rounded-[20px] px-[8px] py-[2px] text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
};

const ProgressBar: React.FC<{ sold: number; maxSupply: number }> = ({ sold, maxSupply }) => {
  const pct = maxSupply > 0 ? Math.min(100, Math.round((sold / maxSupply) * 100)) : 0;
  return (
    <div
      className="mt-[5px] h-[4px] w-full min-w-[80px] overflow-hidden rounded-[4px] bg-[#1a2235]"
      title={`${pct}% đã bán`}
    >
      <div
        className="h-full rounded-[4px] bg-[#34d399] transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

/* ── Event Row ── */
const EventRow: React.FC<{ event: OrganizerEvent; compact?: boolean }> = ({ event, compact }) => (
  <article
    className={`
      grid items-center
      border-b border-[rgba(99,179,237,0.12)]
      last:border-b-0
      hover:bg-[#1a2235] transition-colors duration-[120ms]
      ${
        compact
          ? 'grid-cols-[1fr_auto] gap-[10px] px-[14px] py-[12px]'
          : 'grid-cols-[1fr_auto] sm:grid-cols-[72px_1fr_auto] gap-[14px] px-[20px] py-[14px]'
      }
    `}
  >
    {/* Thumbnail — ẩn trên mobile/compact */}
    {!compact && (
      <div className="hidden sm:block">
        <EventThumbnail bannerUrl={event.bannerUrl} name={event.name} />
      </div>
    )}

    {/* Info */}
    <div className="min-w-0">
      <p className="truncate text-[14px] font-semibold text-[#f1f5f9]">{event.name}</p>
      <div className="mt-[3px] flex flex-wrap items-center gap-[8px] text-[12px] text-[#94a3b8]">
        <StatusBadge status={event.status} />
        <span>#{event.blockchainId}</span>
        <span>
          {event.sold}/{event.maxSupply} vé
        </span>
      </div>
      <ProgressBar sold={event.sold} maxSupply={event.maxSupply} />
    </div>

    {/* Revenue */}
    <div className="text-right shrink-0">
      <p className="text-[11px] uppercase tracking-[0.06em] text-[#94a3b8]">Doanh thu</p>
      <p className="mt-[2px] text-[16px] font-bold text-[#38bdf8]">
        {parseFloat(event.revenueETH || '0').toFixed(4)}
        <span className="ml-[3px] text-[11px] font-normal text-[#94a3b8]">ETH</span>
      </p>
    </div>
  </article>
);

/* ══════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════ */
const OrganizerEventList: React.FC<OrganizerEventListProps> = ({
  events,
  loading,
  error,
  compact,
}) => {
  if (loading) return <Spinner />;
  if (error) return <EmptyState message={error} isError />;
  if (events.length === 0) return <EmptyState message="Không tìm thấy sự kiện nào." />;

  return (
    <div className="flex flex-col">
      {events.map((event) => (
        <EventRow key={event._id} event={event} compact={compact} />
      ))}
    </div>
  );
};

export default OrganizerEventList;
