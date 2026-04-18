import React from 'react';
import type { IVoucherHistory } from '../../types/voucher.type';

/* ══════════════════════════════════════════
   VoucherHistoryModal — Modal lịch sử cập nhật voucher
   ══════════════════════════════════════════ */

type VoucherHistoryModalProps = {
  open: boolean;
  onClose: () => void;
  history: IVoucherHistory[];
};

const VoucherHistoryModal: React.FC<VoucherHistoryModalProps> = ({ open, onClose, history }) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div
          className="
            bg-[#111827] border border-white/[0.08] rounded-2xl
            w-full max-w-lg shadow-[0_24px_64px_rgba(0,0,0,0.5)]
            animate-[vtx-fade_0.2s_ease]
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-full bg-sky-500/[0.1] flex items-center justify-center">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-sky-400"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-white">Lịch sử cập nhật</h3>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[400px] overflow-y-auto">
            <div className="flex flex-col gap-5">
              {history.map((h, i) => (
                <div key={h._id} className="flex items-start gap-3">
                  <span
                    className="
                      shrink-0 px-2.5 py-1 rounded-md
                      bg-slate-700/50 text-[11px] font-bold text-slate-400 font-mono
                    "
                  >
                    v{history.length - i}.0
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-200">
                      {h.action === 'CREATE' ? 'Created voucher' : 'Updated status'}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {h.updatedBy} - {new Date(h.updatedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center px-6 py-4 border-t border-white/[0.06]">
            <button
              onClick={onClose}
              className="
                px-6 py-2.5 rounded-xl text-[13px] font-semibold
                bg-emerald-500 text-white hover:bg-emerald-400
                transition-all cursor-pointer
              "
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoucherHistoryModal;
