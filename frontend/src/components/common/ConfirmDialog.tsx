import React from 'react';

/* ══════════════════════════════════════════
   ConfirmDialog — Modal xác nhận dùng chung
   
   Sử dụng cho: xoá voucher, xoá thành viên, hủy sự kiện, …
   Hỗ trợ 2 variant: 'danger' (màu rose) và 'primary' (emerald).
   ══════════════════════════════════════════ */

type Variant = 'danger' | 'primary';

type Props = {
  open: boolean;
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/* ── Icon theo variant ── */
const ICON: Record<Variant, React.ReactNode> = {
  danger: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  primary: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const VARIANT_STYLES: Record<Variant, { icon: string; button: string }> = {
  danger: {
    icon: 'bg-rose-500/[0.1] border-rose-500/20 text-rose-400',
    button: 'bg-rose-500 hover:bg-rose-400 shadow-[0_2px_12px_rgba(244,63,94,0.25)]',
  },
  primary: {
    icon: 'bg-emerald-500/[0.1] border-emerald-500/20 text-emerald-400',
    button: 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_2px_12px_rgba(16,185,129,0.25)]',
  },
};

const ConfirmDialog: React.FC<Props> = ({
  open,
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  variant = 'danger',
  loading = false,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;
  const styles = VARIANT_STYLES[variant];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div
          className="
            bg-[#111827] border border-white/[0.08] rounded-2xl
            w-full max-w-sm shadow-[0_24px_64px_rgba(0,0,0,0.5)]
            animate-[vtx-fade_0.2s_ease] text-center
          "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 pt-6 pb-4">
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${styles.icon}`}
            >
              {ICON[variant]}
            </div>
            <h3 className="text-[15px] font-bold text-white mb-2">{title}</h3>
            {message && <p className="text-[13px] text-slate-500 leading-relaxed">{message}</p>}
          </div>
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="
                flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium
                text-slate-400 border border-white/[0.08]
                hover:bg-white/[0.04] transition-colors cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`
                flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold
                text-white transition-all cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                inline-flex items-center justify-center gap-2
                ${styles.button}
              `}
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
