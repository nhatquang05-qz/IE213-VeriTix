import React from 'react';
import { MdInfoOutline } from 'react-icons/md';
import type { IVoucherHistory } from '../../types/voucher.type';

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
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4">
        <div
          className="
            bg-[#111827] border border-white/[0.08] rounded-2xl
            w-full max-w-lg shadow-[0_24px_64px_rgba(0,0,0,0.5)]
            animate-[vtx-fade_0.2s_ease]
            max-h-[90vh] flex flex-col
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06] shrink-0">
            <div className="w-8 h-8 rounded-full bg-sky-500/[0.1] flex items-center justify-center text-sky-400">
              <MdInfoOutline size={16} />
            </div>
            <h3 className="text-[15px] font-bold text-white">Lịch sử cập nhật</h3>
          </div>

          {/* Body */}
          <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1">
            {history.length === 0 ? (
              <p className="text-[13px] text-slate-600 text-center py-6">
                Chưa có lịch sử cập nhật
              </p>
            ) : (
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
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-200">
                        {h.action === 'CREATE' ? 'Created voucher' : 'Updated status'}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5 break-words">
                        {h.updatedBy} - {new Date(h.updatedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-center px-6 py-4 border-t border-white/[0.06] shrink-0">
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
