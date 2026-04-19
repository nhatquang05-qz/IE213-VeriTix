import React from 'react';
import { MdEdit, MdHistory, MdDelete } from 'react-icons/md';
import type { IVoucher, VoucherStatus } from '../../types/voucher.type';

/* ══════════════════════════════════════════
   VoucherCard — Row desktop
   VoucherMobileCard — Card mobile (named export)
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

const fmtDate = (iso: string) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '—');

const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher: v,
  onEdit,
  onShowHistory,
  onDelete,
}) => {
  const sCfg = STATUS_CFG[v.status];

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
          <button
            onClick={() => onEdit(v)}
            title="Sửa"
            className="p-2 rounded-lg text-slate-600 hover:text-sky-400 hover:bg-sky-400/[0.06] transition-all cursor-pointer"
          >
            <MdEdit size={15} />
          </button>
          <button
            onClick={() => onShowHistory(v._id)}
            title="Lịch sử"
            className="p-2 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-amber-400/[0.06] transition-all cursor-pointer"
          >
            <MdHistory size={15} />
          </button>
          <button
            onClick={() => onDelete(v)}
            title="Xoá"
            className="p-2 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-400/[0.06] transition-all cursor-pointer"
          >
            <MdDelete size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

/* ── Mobile card: dùng dưới md breakpoint ── */
export const VoucherMobileCard: React.FC<VoucherCardProps> = ({
  voucher: v,
  onEdit,
  onShowHistory,
  onDelete,
}) => {
  const sCfg = STATUS_CFG[v.status];
  return (
    <div className="bg-[#0d1117] border border-white/[0.06] rounded-xl p-4">
      {/* Header: code + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-[14px] font-mono font-bold text-slate-100 break-all">{v.code}</span>
        <span
          className={`shrink-0 inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${sCfg.cls}`}
        >
          {sCfg.label}
        </span>
      </div>

      {/* Data grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[10.5px] text-slate-600 uppercase tracking-wider mb-0.5">Mức giảm</p>
          <p className="text-[12.5px] text-slate-300 font-mono font-semibold">
            {v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : `Ξ ${v.discountValue}`}
          </p>
        </div>
        <div>
          <p className="text-[10.5px] text-slate-600 uppercase tracking-wider mb-0.5">Đã dùng</p>
          <p className="text-[12.5px] text-slate-300 font-mono font-semibold">
            {v.usedCount}/{v.maxUsage}
          </p>
        </div>
      </div>

      <p className="text-[11.5px] text-slate-500 mb-3">
        {fmtDate(v.startDate)} → {fmtDate(v.endDate)}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
        <button
          onClick={() => onEdit(v)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[12px] font-medium text-sky-400 hover:bg-sky-400/[0.06] transition-colors cursor-pointer"
        >
          <MdEdit size={14} /> Sửa
        </button>
        <button
          onClick={() => onShowHistory(v._id)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[12px] font-medium text-amber-400 hover:bg-amber-400/[0.06] transition-colors cursor-pointer"
        >
          <MdHistory size={14} /> Lịch sử
        </button>
        <button
          onClick={() => onDelete(v)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[12px] font-medium text-rose-400 hover:bg-rose-400/[0.06] transition-colors cursor-pointer"
        >
          <MdDelete size={14} /> Xoá
        </button>
      </div>
    </div>
  );
};

export default VoucherCard;
