import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdAdd, MdCardGiftcard } from 'react-icons/md';
import type { EventDetailContext } from '../../../types/organizer.type';
import type { IVoucher, IVoucherHistory } from '../../../types/voucher.type';
import VoucherCard, { VoucherMobileCard } from '../../../components/organizer-detail-event/VoucherCard';
import VoucherForm, { type VoucherFormDataExtended } from '../../../components/organizer-detail-event/VoucherForm';
import VoucherHistoryModal from '../../../components/organizer-detail-event/VoucherHistoryModal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import EmptyState from '../../../components/common/EmptyState';

// IMPORT AXIOS API CỦA BRO VÀO ĐÂY (Thay vì dùng Mock)
import api, { getErrorMessage } from '../../../services/api'; 

export default function EventVouchersPage() {
  const { event } = useOutletContext<EventDetailContext>();
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Thêm state loading

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

  // 1. HÀM LẤY DATA THẬT TỪ BACKEND
  const fetchVouchers = async () => {
    if (!event) return;
    try {
      setIsLoading(true);
      // Giả định endpoint backend của bro là: GET /api/vouchers/event/:eventId
      const response = await api.get(`/vouchers/event/${event._id}`);
      // Tuỳ thuộc vào backend trả về { data: [...] } hay trả thẳng mảng
      setVouchers(response.data.data || response.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Lỗi khi tải danh sách voucher');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [event]);

  if (!event) return null;

  // 2. HÀM TẠO MỚI / CẬP NHẬT VOUCHER GỌI API
  const handleSubmitForm = async (form: VoucherFormDataExtended) => {
    try {
      if (formModal.editing) {
        // CẬP NHẬT (PUT)
        const payload = {
          discountType: form.discountType,
          discountValue: Number(form.discountValue) || 0,
          maxUsage: form.unlimited ? 999999 : Number(form.maxUsage) || 0,
          startDate: form.startDate,
          endDate: form.endDate,
        };
        await api.put(`/vouchers/${formModal.editing._id}`, payload);
        toast.success('Cập nhật voucher thành công');

      } else if (form.mode === 'bulk') {
        // TẠO HÀNG LOẠT (POST BULK)
        const payload = {
          eventId: event._id,
          prefix: (form.prefix || '').toUpperCase(),
          quantity: Math.min(5000, Math.max(1, Number(form.quantity) || 0)),
          discountType: form.discountType,
          discountValue: Number(form.discountValue) || 0,
          maxUsage: form.unlimited ? 999999 : Number(form.maxUsage) || 0,
          startDate: form.startDate,
          endDate: form.endDate,
        };
        await api.post(`/vouchers/bulk`, payload);
        toast.success(`Đã tạo ${payload.quantity} voucher`);

      } else {
        // TẠO ĐƠN LẺ (POST SINGLE)
        const payload = {
          eventId: event._id,
          code: form.code.toUpperCase(),
          discountType: form.discountType,
          discountValue: Number(form.discountValue) || 0,
          maxUsage: form.unlimited ? 999999 : Number(form.maxUsage) || 0,
          startDate: form.startDate,
          endDate: form.endDate,
        };
        await api.post(`/vouchers`, payload);
        toast.success('Tạo voucher thành công');
      }

      setFormModal({ open: false, editing: null });
      fetchVouchers(); // Refresh lại danh sách sau khi tạo/sửa xong

    } catch (err) {
      toast.error(getErrorMessage(err) || 'Không thể lưu voucher. Vui lòng thử lại.');
      console.error(err);
    }
  };

  // 3. HÀM LẤY LỊCH SỬ SỬ DỤNG GỌI API
  const handleShowHistory = async (voucherId: string) => {
    try {
      const response = await api.get(`/vouchers/${voucherId}/history`);
      setHistoryModal({ open: true, data: response.data.data || response.data || [] });
    } catch (error) {
      toast.error('Không thể lấy lịch sử voucher');
    }
  };

  // 4. HÀM XOÁ VOUCHER GỌI API
  const handleDelete = async () => {
    if (!deleteModal.voucher) return;
    try {
      await api.delete(`/vouchers/${deleteModal.voucher._id}`);
      toast.success('Đã xoá voucher');
      setDeleteModal({ open: false, voucher: null });
      fetchVouchers(); // Refresh lại danh sách
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Không thể xoá voucher');
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

      {isLoading ? (
        <div className="text-center py-10 text-slate-400">Đang tải dữ liệu...</div>
      ) : vouchers.length === 0 ? (
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
                    onShowHistory={() => handleShowHistory(v._id)}
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
                onShowHistory={() => handleShowHistory(v._id)}
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