import React, { useState, useEffect } from 'react';
import type { EventFormData } from './CreateEventSteps';
import { getEthToVndRate } from '../../services/currency.service';

type Props = {
  form: EventFormData;
  errors: Record<string, string>;
  set: (k: keyof EventFormData, v: string | number) => void;
};

const inputCls = (err?: boolean) =>
  `w-full bg-[#080b14] border rounded-[10px] px-4 py-3 text-sm text-slate-100 outline-none
   transition-all duration-200 placeholder:text-slate-700
   focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]
   ${err ? 'border-rose-500' : 'border-white/10 hover:border-white/[0.18]'}`;

const DateTimeField: React.FC<{
  dateKey: keyof EventFormData;
  timeKey: keyof EventFormData;
  label: string;
  form: EventFormData;
  errors: Record<string, string>;
  set: (k: keyof EventFormData, v: string) => void;
}> = ({ dateKey, timeKey, label, form, errors, set }) => (
  <div>
    <label className="text-[13px] font-medium text-slate-400 flex items-center gap-1 mb-2">
      <span className="text-rose-500 text-sm">*</span> {label}
    </label>
    <div className="grid grid-cols-2 gap-2.5">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
        <input
          type="date"
          value={form[dateKey] as string}
          onChange={(e) => set(dateKey, e.target.value)}
          className={`${inputCls(!!errors[dateKey])} pl-9`}
        />
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
        <input
          type="time"
          value={form[timeKey] as string}
          onChange={(e) => set(timeKey, e.target.value)}
          className={`${inputCls()} pl-9`}
        />
      </div>
    </div>
    {errors[dateKey] && <p className="text-[11px] text-rose-500 mt-1">{errors[dateKey]}</p>}
  </div>
);

const Step2TicketConfig: React.FC<Props> = ({ form, errors, set }) => {
  const [ethRate, setEthRate] = useState<number>(80000000);

  useEffect(() => {
    getEthToVndRate().then(setEthRate);
  }, []);

  const royaltyPct = (form.resaleRoyalty / 30) * 100;

  // Hàm hỗ trợ format tiền tệ hiển thị (VND -> ETH)
  const calculateEth = (vndPrice: string) => {
    if (!vndPrice || isNaN(Number(vndPrice))) return '0';
    return (Number(vndPrice) / ethRate).toFixed(6);
  };

  return (
    <div className="flex flex-col gap-3.5 animate-[vtx-fade_0.4s_ease]">
      {/* ── Vé tiêu chuẩn ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7">
        <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-600 pb-3.5 border-b border-white/[0.06] mb-5">
          🎫 Vé tiêu chuẩn · On-chain
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-medium text-slate-400 flex items-center justify-between mb-2">
              <span className="flex items-center gap-1"><span className="text-rose-500 text-sm">*</span> Giá vé (VND)</span>
              {form.price && (
                <span className="text-blue-400 font-semibold text-xs tracking-wide">
                  ≈ {calculateEth(form.price)} ETH
                </span>
              )}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-slate-600 pointer-events-none">
                ₫
              </span>
              <input
                type="text"
                value={form.price}
                onChange={(e) => set('price', e.target.value.replace(/\D/g, ''))} // Chỉ cho nhập số
                placeholder="100000"
                className={`${inputCls(!!errors.price)} pl-8 font-mono`}
              />
            </div>
            {errors.price && <p className="text-[11px] text-rose-500 mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="text-[13px] font-medium text-slate-400 flex items-center gap-1 mb-2">
              <span className="text-rose-500 text-sm">*</span> Tổng số vé
            </label>
            <input
              type="number"
              min="1"
              value={form.maxSupply}
              onChange={(e) => set('maxSupply', e.target.value)}
              placeholder="1000"
              className={inputCls(!!errors.maxSupply)}
            />
            {errors.maxSupply && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.maxSupply}</p>
            )}
          </div>
        </div>

        {/* Range */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2.5">
            <label className="text-[13px] font-medium text-slate-400">Phí bản quyền bán lại</label>
            <span className="text-[13px] font-semibold text-blue-400">{form.resaleRoyalty}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={form.resaleRoyalty}
            onChange={(e) => set('resaleRoyalty', Number(e.target.value))}
            className="w-full h-1 rounded-full border-none outline-none cursor-pointer appearance-none"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${royaltyPct}%, #1e293b ${royaltyPct}%, #1e293b 100%)`,
            }}
          />
          <div className="flex justify-between text-[11px] text-slate-700 mt-2">
            <span>0% — Không thu</span>
            <span>30% — Tối đa</span>
          </div>
        </div>
      </div>

      {/* ── Vé bổ sung ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7">
        <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-600 pb-3.5 border-b border-white/[0.06] mb-5">
          Loại vé bổ sung (Tùy chọn)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Early Bird */}
          <div className="bg-blue-500/[0.04] rounded-xl p-4 border border-blue-500/10">
            <p className="text-[13px] font-semibold text-blue-400 mb-3.5">🎟️ Early Bird</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 flex justify-between">
                  <span>Giá (VND)</span>
                  {form.earlyBirdPrice && <span className="text-blue-400">≈ {calculateEth(form.earlyBirdPrice)} ETH</span>}
                </label>
                <input
                  type="text"
                  value={form.earlyBirdPrice}
                  onChange={(e) => set('earlyBirdPrice', e.target.value.replace(/\D/g, ''))}
                  placeholder="80000"
                  className={`${inputCls()} text-[13px] py-2.5 font-mono`}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Số lượng</label>
                <input
                  type="number"
                  min="0"
                  value={form.earlyBirdQty}
                  onChange={(e) => set('earlyBirdQty', e.target.value)}
                  placeholder="200"
                  className={`${inputCls()} text-[13px] py-2.5`}
                />
              </div>
            </div>
          </div>
          {/* VIP */}
          <div className="bg-purple-500/[0.04] rounded-xl p-4 border border-purple-500/10">
            <p className="text-[13px] font-semibold text-purple-400 mb-3.5">👑 VIP</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 flex justify-between">
                  <span>Giá (VND)</span>
                  {form.vipPrice && <span className="text-purple-400">≈ {calculateEth(form.vipPrice)} ETH</span>}
                </label>
                <input
                  type="text"
                  value={form.vipPrice}
                  onChange={(e) => set('vipPrice', e.target.value.replace(/\D/g, ''))}
                  placeholder="250000"
                  className={`${inputCls()} text-[13px] py-2.5 font-mono`}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Số lượng</label>
                <input
                  type="number"
                  min="0"
                  value={form.vipQty}
                  onChange={(e) => set('vipQty', e.target.value)}
                  placeholder="50"
                  className={`${inputCls()} text-[13px] py-2.5`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lịch trình bán vé ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7">
        <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-600 pb-3.5 border-b border-white/[0.06] mb-5">
          📅 Lịch trình bán vé
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DateTimeField dateKey="saleStartDate" timeKey="saleStartTime" label="Bắt đầu bán vé" form={form} errors={errors} set={set} />
          <DateTimeField dateKey="saleEndDate" timeKey="saleEndTime" label="Kết thúc bán vé" form={form} errors={errors} set={set} />
        </div>
      </div>

      {/* ── Lịch trình sự kiện ── */}
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7">
        <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-600 pb-3.5 border-b border-white/[0.06] mb-5">
          🗓️ Lịch trình sự kiện
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DateTimeField dateKey="eventStartDate" timeKey="eventStartTime" label="Ngày bắt đầu" form={form} errors={errors} set={set} />
          <DateTimeField dateKey="eventEndDate" timeKey="eventEndTime" label="Ngày kết thúc" form={form} errors={errors} set={set} />
        </div>
      </div>
    </div>
  );
};

export default Step2TicketConfig;