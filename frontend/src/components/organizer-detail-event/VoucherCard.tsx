import React from 'react';
import type { IVoucher, VoucherStatus } from '../../types/voucher.type';

/* ══════════════════════════════════════════
   VoucherCard — Row trong bảng voucher

   Thay đổi:
   - ✅ Thêm prop `onEdit` để nút "Sửa" hoạt động
     (trước đây nút Sửa không có handler → user click không gì xảy ra)
   ══════════════════════════════════════════ */

const STATUS_CFG: Record<VoucherStatus, { label: string; cls: string }> = {
  ACTIVE: {
    label: 'Hoạt động',
    cls: 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20',
  },
  EXPIRED: { label: 'Hết hạn', cls: 'text-slate-400 bg-slate-500/[0.08] border-slate-500/20' },
  DISABLED: { label: 'Vô hiệu', cls: 'text-rose-400 bg-rose-500/[0.08] border-rose-500/20' },
};

type VoucherCardProps = {
  voucher: IVoucher;
  onEdit: (voucher: IVoucher) => void;
  onShowHistory: (voucherId: string) => void;
  onDelete: (voucher: IVoucher) => void;
};

const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher: v,
  onEdit,
  onShowHistory,
  onDelete,
}) => {
  const sCfg = STATUS_CFG[v.status];
  const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '—');

  return (
    <tr className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors">
      <td className="px-5 py-4">
        <span className="text-[13px] font-mono font-semibold text-slate-200">{v.code}</span>
      </td>
      <td className="px-5 py-4 text-[13px] text-slate-400 font-mono">
        {v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : `Ξ ${v.discountValue}`}
      </td>
      <td className="px-5 py-4 text-[13px] text-slate-400 font-mono">
        {v.usedCount}/{v.maxUsage}
      </td>
      <td className="px-5 py-4">
        <p className="text-[12px] text-slate-500">
          {fmtDate(v.startDate)} - {fmtDate(v.endDate)}
        </p>
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold border ${sCfg.cls}`}
        >
          {sCfg.label}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-1">
          {/* Edit – GIỜ CÓ HANDLER */}
          <button
            onClick={() => onEdit(v)}
            className="p-2 rounded-lg text-slate-600 hover:text-sky-400 hover:bg-sky-400/[0.06] transition-all cursor-pointer"
            title="Sửa"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {/* History */}
          <button
            onClick={() => onShowHistory(v._id)}
            className="p-2 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-amber-400/[0.06] transition-all cursor-pointer"
            title="Lịch sử"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(v)}
            className="p-2 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-400/[0.06] transition-all cursor-pointer"
            title="Xoá"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default VoucherCard;
