import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdAdd, MdCardGiftcard } from 'react-icons/md';
import type { EventDetailContext } from '../../../types/organizer.type';
import type { IVoucher, IVoucherHistory } from '../../../types/voucher.type';
import VoucherCard, {
  VoucherMobileCard,
} from '../../../components/organizer-detail-event/VoucherCard';
import VoucherForm from '../../../components/organizer-detail-event/VoucherForm';
import type { VoucherFormDataExtended } from '../../../components/organizer-detail-event/VoucherForm';
import VoucherHistoryModal from '../../../components/organizer-detail-event/VoucherHistoryModal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import EmptyState from '../../../components/common/EmptyState';
import {
  MOCK_VOUCHERS_BY_EVENT,
  MOCK_VOUCHER_HISTORY_BY_VOUCHER,
} from '../../../mocks/vouchers.mock';

const randomSuffix = (len = 6): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return out;
};

export default function EventVouchersPage() {
  const { event } = useOutletContext<EventDetailContext>();
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);

  const [formModal, setFormModal] = useState<{ open: boolean; editing: IVoucher | null }>({
    open: false,
    editing: null,
  });

  const [historyModal, setHistoryModal] = useState<{ open: boolean; data: IVoucherHistory[] }>({
    open: false,
    data: [],
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; voucher: IVoucher | null }>({
    open: false,
    voucher: null,
  });

  useEffect(() => {
    if (!event) return;
    const eventVouchers = MOCK_VOUCHERS_BY_EVENT[event._id] || [];
    setVouchers(eventVouchers.map((v) => ({ ...v })));
  }, [event]);

  if (!event) return null;

  const handleSubmitForm = (form: VoucherFormDataExtended) => {
    try {
      if (formModal.editing) {
        const updated: IVoucher = {
          ...formModal.editing,
          discountType: form.discountType,
          discountValue: Number(form.discountValue) || 0,
          maxUsage: form.unlimited ? 999999 : Number(form.maxUsage) || 0,
          startDate: form.startDate,
          endDate: form.endDate,
          updatedAt: new Date().toISOString(),
        };
        setVouchers((prev) => prev.map((v) => (v._id === updated._id ? updated : v)));
        toast.success('Cập nhật voucher thành công');
        setFormModal({ open: false, editing: null });
        return;
      }

      if (form.mode === 'bulk') {
        const qty = Math.min(5000, Math.max(1, Number(form.quantity) || 0));
        const prefix = (form.prefix || '').toUpperCase();
        const batch: IVoucher[] = [];
        const now = new Date().toISOString();
        for (let i = 0; i < qty; i++) {
          batch.push({
            _id: `${Date.now()}_${i}`,
            eventId: event._id,
            code: `${prefix}${randomSuffix(6)}`,
            discountType: form.discountType,
            discountValue: Number(form.discountValue) || 0,
            maxUsage: form.unlimited ? 999999 : Number(form.maxUsage) || 0,
            usedCount: 0,
            startDate: form.startDate,
            endDate: form.endDate,
            status: 'ACTIVE',
            createdAt: now,
            updatedAt: now,
          });
        }
        setVouchers((prev) => [...prev, ...batch]);
        toast.success(`Đã tạo ${qty} voucher`);
      } else {
        const newVoucher: IVoucher = {
          _id: Date.now().toString(),
          eventId: event._id,
          code: form.code.toUpperCase(),
          discountType: form.discountType,
          discountValue: Number(form.discountValue) || 0,
          maxUsage: form.unlimited ? 999999 : Number(form.maxUsage) || 0,
          usedCount: 0,
          startDate: form.startDate,
          endDate: form.endDate,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setVouchers((prev) => [...prev, newVoucher]);
        toast.success('Tạo voucher thành công');
      }

      setFormModal({ open: false, editing: null });
    } catch (err) {
      toast.error('Không thể lưu voucher. Vui lòng thử lại.');
      console.error(err);
    }
  };

  const handleShowHistory = (voucherId: string) => {
    const history = MOCK_VOUCHER_HISTORY_BY_VOUCHER[voucherId] || [];
    setHistoryModal({ open: true, data: history });
  };

  const handleDelete = () => {
    if (!deleteModal.voucher) return;
    try {
      setVouchers((prev) => prev.filter((v) => v._id !== deleteModal.voucher!._id));
      toast.success('Đã xoá voucher');
      setDeleteModal({ open: false, voucher: null });
    } catch (err) {
      toast.error('Không thể xoá voucher');
      console.error(err);
    }
  };

  return (
    <div className="max-w-[960px] mx-auto animate-[vtx-fade_0.35s_ease]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-bold text-white">Voucher</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono text-slate-500">
            {vouchers.length} / 5000
          </span>
        </div>
        <button
          onClick={() => setFormModal({ open: true, editing: null })}
          className="
            flex items-center gap-2 px-4 py-2.5
            bg-emerald-500 hover:bg-emerald-400 text-white
            text-[13px] font-semibold rounded-xl transition-all cursor-pointer
            shadow-[0_2px_12px_rgba(16,185,129,0.25)]
            justify-center sm:justify-start
          "
        >
          <MdAdd size={16} />
          Tạo voucher
        </button>
      </div>

      {vouchers.length === 0 ? (
        <EmptyState
          icon={<MdCardGiftcard size={28} />}
          title="Chưa có voucher nào"
          description='Nhấn "Tạo voucher" để bắt đầu'
        />
      ) : (
        <>
          {/* ══ Desktop: Table ══ */}
          <div className="hidden md:block bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Mã voucher', 'Mức giảm', 'Đã dùng', 'Thời gian áp dụng', 'Trạng thái', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {vouchers.map((v) => (
                  <VoucherCard
                    key={v._id}
                    voucher={v}
                    onEdit={(voucher) => setFormModal({ open: true, editing: voucher })}
                    onShowHistory={handleShowHistory}
                    onDelete={(voucher) => setDeleteModal({ open: true, voucher })}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* ══ Mobile: Card stack ══ */}
          <div className="md:hidden flex flex-col gap-2.5">
            {vouchers.map((v) => (
              <VoucherMobileCard
                key={v._id}
                voucher={v}
                onEdit={(voucher) => setFormModal({ open: true, editing: voucher })}
                onShowHistory={handleShowHistory}
                onDelete={(voucher) => setDeleteModal({ open: true, voucher })}
              />
            ))}
          </div>
        </>
      )}

      <VoucherForm
        open={formModal.open}
        onClose={() => setFormModal({ open: false, editing: null })}
        onSubmit={handleSubmitForm}
        initial={formModal.editing}
      />

      <VoucherHistoryModal
        open={historyModal.open}
        onClose={() => setHistoryModal({ open: false, data: [] })}
        history={historyModal.data}
      />

      <ConfirmDialog
        open={deleteModal.open}
        variant="danger"
        title="Xoá voucher?"
        message={
          <>
            Bạn có chắc muốn xoá voucher{' '}
            <span className="font-mono text-slate-300">{deleteModal.voucher?.code}</span>? Hành động
            này không thể hoàn tác.
          </>
        }
        confirmLabel="Xoá"
        onClose={() => setDeleteModal({ open: false, voucher: null })}
        onConfirm={handleDelete}
      />
    </div>
  );
}
