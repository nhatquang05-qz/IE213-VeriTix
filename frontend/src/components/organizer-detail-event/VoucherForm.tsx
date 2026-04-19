import React, { useEffect, useState } from 'react';
import { MdClose, MdKeyboardArrowDown } from 'react-icons/md';
import type { VoucherFormData, DiscountType, IVoucher } from '../../types/voucher.type';

const inputCls = `
  w-full bg-[#080b14] border border-white/[0.1] rounded-xl
  px-4 py-3 text-sm text-slate-100
  placeholder:text-slate-700 outline-none
  focus:border-emerald-500/40 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)]
  transition-all hover:border-white/[0.15]
`;

export type VoucherFormDataExtended = VoucherFormData & {
  name?: string;
  description?: string;
  mode?: 'single' | 'bulk';
  quantity?: string;
  prefix?: string;
  unlimited?: boolean;
};

type VoucherFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: VoucherFormDataExtended) => void;
  initial?: IVoucher | null;
};

const EMPTY: VoucherFormDataExtended = {
  code: '',
  name: '',
  description: '',
  mode: 'single',
  quantity: '',
  prefix: '',
  discountType: 'PERCENTAGE',
  discountValue: '',
  maxUsage: '',
  unlimited: false,
  startDate: '',
  endDate: '',
};

const VoucherForm: React.FC<VoucherFormProps> = ({ open, onClose, onSubmit, initial }) => {
  const [form, setForm] = useState<VoucherFormDataExtended>(EMPTY);

  const isEdit = !!initial;

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        code: initial.code,
        name: '',
        description: '',
        mode: 'single',
        quantity: '',
        prefix: '',
        discountType: initial.discountType,
        discountValue: initial.discountValue.toString(),
        maxUsage: initial.maxUsage.toString(),
        unlimited: false,
        startDate: initial.startDate ? initial.startDate.slice(0, 16) : '',
        endDate: initial.endDate ? initial.endDate.slice(0, 16) : '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, initial]);

  if (!open) return null;

  const setField = <K extends keyof VoucherFormDataExtended>(
    k: K,
    v: VoucherFormDataExtended[K]
  ) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const handleSubmit = () => {
    if (form.mode === 'single' && !form.code.trim()) return;
    if (form.mode === 'bulk' && (!form.quantity || !form.prefix)) return;
    onSubmit(form);
  };

  const canSubmit =
    form.mode === 'single'
      ? !!form.code.trim() && (form.unlimited || !!form.maxUsage)
      : !!form.quantity && !!form.prefix && (form.unlimited || !!form.maxUsage);

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div
          className="
            bg-[#111827] border border-white/[0.08] rounded-2xl
            w-full max-w-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5)]
            animate-[vtx-fade_0.25s_ease]
            my-4 sm:my-6 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] flex flex-col
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06] shrink-0">
            <h3 className="text-[15px] font-bold text-white">
              {isEdit ? 'Chỉnh sửa voucher' : 'Tạo voucher'}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer p-1 -m-1"
              aria-label="Đóng"
            >
              <MdClose size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 sm:px-6 py-5 overflow-y-auto flex flex-col gap-5">
            {/* Mode selector */}
            {!isEdit && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    key: 'single' as const,
                    title: 'Tạo 1 mã',
                    desc: 'Tạo một mã voucher duy nhất cho sự kiện của bạn',
                  },
                  {
                    key: 'bulk' as const,
                    title: 'Tạo nhiều mã',
                    desc: 'Mã voucher sẽ được tạo ngẫu nhiên hàng loạt theo prefix',
                  },
                ].map((opt) => {
                  const active = form.mode === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setField('mode', opt.key)}
                      className={`
                        text-left p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all
                        ${
                          active
                            ? 'bg-emerald-500/[0.06] border-emerald-500/40 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]'
                            : 'bg-[#0d1117] border-white/[0.06] hover:border-white/[0.15]'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[13px] font-bold text-white">{opt.title}</span>
                        <span
                          className={`
                            shrink-0 text-[10.5px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full
                            ${
                              active
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white/[0.04] text-slate-500 border border-white/[0.06]'
                            }
                          `}
                        >
                          {active ? 'Đã chọn' : 'Chọn'}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-slate-500 leading-relaxed">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ══════ Thông tin cơ bản ══════ */}
            <div>
              <h4 className="text-[13px] font-bold text-slate-300 mb-3">Thông tin cơ bản</h4>

              {/* Tên chương trình */}
              <div className="mb-4">
                <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">
                  Tên chương trình khuyến mãi <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.name || ''}
                    onChange={(e) => setField('name', e.target.value.slice(0, 80))}
                    placeholder="Nhập tên chương trình khuyến mãi"
                    maxLength={80}
                    className={`${inputCls} pr-14`}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-700 font-mono pointer-events-none">
                    {(form.name || '').length} / 80
                  </span>
                </div>
                <p className="text-[10px] text-slate-700 mt-1">
                  Tên chương trình sẽ không hiển thị cho người mua
                </p>
              </div>

              {/* Single: Mã voucher */}
              {form.mode === 'single' && (
                <div className="mb-4">
                  <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">
                    Mã voucher <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) =>
                      setField(
                        'code',
                        e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, '')
                          .slice(0, 12)
                      )
                    }
                    placeholder="VD: EARLY20"
                    maxLength={12}
                    disabled={isEdit}
                    className={`${inputCls} font-mono uppercase ${isEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                  <p className="text-[10px] text-slate-700 mt-1">A-Z, 0-9, tối đa 12 ký tự</p>
                </div>
              )}

              {/* Bulk: Quantity + Prefix */}
              {form.mode === 'bulk' && !isEdit && (
                <>
                  <div className="mb-4">
                    <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">
                      Số lượng mã voucher <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5000}
                      value={form.quantity || ''}
                      onChange={(e) => setField('quantity', e.target.value)}
                      placeholder="Nhập số lượng mã cần tạo"
                      className={inputCls}
                    />
                    <p className="text-[10px] text-slate-700 mt-1">
                      Có thể tạo tối đa 5000 mã. Mỗi mã chỉ có thể áp dụng 1 lần duy nhất.
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">
                      Prefix <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.prefix || ''}
                        onChange={(e) =>
                          setField(
                            'prefix',
                            e.target.value
                              .toUpperCase()
                              .replace(/[^A-Z0-9]/g, '')
                              .slice(0, 10)
                          )
                        }
                        placeholder="HELLO"
                        maxLength={10}
                        className={`${inputCls} font-mono uppercase pr-14`}
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-700 font-mono pointer-events-none">
                        {(form.prefix || '').length} / 10
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-700 mt-1 break-words">
                      Mã sẽ được tạo ngẫu nhiên theo mẫu: {form.prefix || 'HELLO'}
                      <span className="text-slate-500"> + &lt;random&gt;</span>
                    </p>
                  </div>
                </>
              )}

              {/* Thời gian sử dụng mã */}
              <div className="mb-4">
                <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">
                  Thời gian sử dụng mã <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-600 mb-1 block">Bắt đầu</span>
                    <input
                      type="datetime-local"
                      value={form.startDate}
                      onChange={(e) => setField('startDate', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 mb-1 block">Kết thúc</span>
                    <input
                      type="datetime-local"
                      value={form.endDate}
                      onChange={(e) => setField('endDate', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Nội dung */}
              <div>
                <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">
                  Nội dung
                </label>
                <textarea
                  value={form.description || ''}
                  onChange={(e) => setField('description', e.target.value)}
                  rows={3}
                  placeholder="Điều khoản và quy định của chương trình khuyến mãi này"
                  className={`${inputCls} resize-y min-h-[80px] leading-relaxed`}
                />
              </div>
            </div>

            {/* ══════ Thiết lập mã voucher ══════ */}
            <div className="border-t border-white/[0.04] pt-5">
              <h4 className="text-[13px] font-bold text-slate-300 mb-3">Thiết lập mã voucher</h4>

              {/* Loại khuyến mãi + Mức giảm */}
              <div className="mb-4">
                <label className="text-[12px] font-medium text-slate-400 mb-1.5 block">
                  Loại khuyến mãi <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3">
                  <div className="relative">
                    <select
                      value={form.discountType}
                      onChange={(e) => setField('discountType', e.target.value as DiscountType)}
                      className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                    >
                      <option value="PERCENTAGE">Theo %</option>
                      <option value="FIXED">Theo Ξ</option>
                    </select>
                    <MdKeyboardArrowDown
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min={0}
                      value={form.discountValue}
                      onChange={(e) => setField('discountValue', e.target.value)}
                      placeholder="Nhập mức giảm"
                      className={`${inputCls} pr-10`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] text-slate-500 font-mono pointer-events-none">
                      {form.discountType === 'PERCENTAGE' ? '%' : 'Ξ'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tổng số vé được áp dụng */}
              <div>
                <label className="text-[12px] font-medium text-slate-400 mb-2 block">
                  Tổng số vé được áp dụng <span className="text-rose-400">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-2">
                  {[
                    { key: false, label: 'Giới hạn' },
                    { key: true, label: 'Không giới hạn' },
                  ].map((opt) => (
                    <label
                      key={String(opt.key)}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="radio"
                        checked={!!form.unlimited === opt.key}
                        onChange={() => setField('unlimited', opt.key)}
                        className="accent-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-[13px] text-slate-300">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {!form.unlimited && (
                  <>
                    <input
                      type="number"
                      min={1}
                      value={form.maxUsage}
                      onChange={(e) => setField('maxUsage', e.target.value)}
                      placeholder="Nhập số lượng vé"
                      className={inputCls}
                    />
                    <p className="text-[10px] text-slate-700 mt-1">
                      Số vé được khuyến mãi mỗi voucher
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer: stack mobile, row desktop */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2.5 sm:gap-3 px-5 sm:px-6 py-4 border-t border-white/[0.06] shrink-0">
            <button
              onClick={onClose}
              className="
                px-4 py-2.5 rounded-xl text-[13px] font-medium
                text-slate-400 border border-white/[0.08]
                hover:bg-white/[0.04] transition-colors cursor-pointer
              "
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="
                px-6 py-2.5 rounded-xl text-[13px] font-semibold
                bg-emerald-500 text-white hover:bg-emerald-400
                transition-all cursor-pointer
                shadow-[0_2px_12px_rgba(16,185,129,0.25)]
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {isEdit ? 'Lưu thay đổi' : 'Tạo voucher'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoucherForm;
