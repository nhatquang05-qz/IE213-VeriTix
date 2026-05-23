import React from 'react';
import type { EventFormData } from './CreateEventSteps';

type Props = {
  form: EventFormData;
  errors: Record<string, string>;
  set: (k: keyof EventFormData, v: string | number) => void;
  bannerFile: File | null;
  loading: boolean;
  statusMsg: string;
  onSubmit: () => void;
};

const Step3PaymentPublish: React.FC<Props> = ({
  form,
  bannerFile,
  loading,
  statusMsg,
  onSubmit,
}) => {
  return (
    <div className="flex flex-col gap-3.5 animate-[vtx-fade_0.4s_ease]">
      <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 md:p-7">
        <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-slate-600 pb-3.5 border-b border-white/[0.06] mb-5">
          📊 Tóm tắt cấu hình sự kiện
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { l: 'Giá vé', v: form.price ? `Ξ ${parseFloat(form.price).toFixed(4)}` : 'Miễn phí' },
            { l: 'Số vé', v: form.maxSupply ? parseInt(form.maxSupply).toLocaleString() : '—' },
            { l: 'Royalty', v: `${form.resaleRoyalty}%` },
            { l: 'Thể loại', v: form.category || '—' },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-white/[0.02] border border-white/[0.06] rounded-[10px] py-3.5 px-3 text-center"
            >
              <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-1.5">
                {s.l}
              </div>
              <div className="text-[15px] font-bold text-slate-100 truncate">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          {[
            ['Tên sự kiện', form.name || '—'],
            ['Địa điểm', form.locationType === 'online' ? 'Online' : form.venueName || '—'],
            [
              'Bán vé',
              `${form.saleStartDate || '—'} ${form.saleStartTime} → ${form.saleEndDate || '—'} ${form.saleEndTime}`,
            ],
            [
              'Sự kiện',
              `${form.eventStartDate || '—'} ${form.eventStartTime} → ${form.eventEndDate || '—'} ${form.eventEndTime}`,
            ],
            ['Ảnh nền', bannerFile ? bannerFile.name : 'Chưa upload'],
            ['Ban tổ chức', form.orgName || '—'],
          ].map(([l, v]) => (
            <div
              key={l}
              className="flex justify-between items-center py-2.5 border-b border-white/[0.04] last:border-b-0"
            >
              <span className="text-[13px] text-slate-600">{l}</span>
              <span className="text-[13px] font-medium text-slate-400 text-right max-w-[60%] break-words">
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {statusMsg && (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-blue-500/20 bg-blue-500/[0.05] text-[13px] text-blue-300 animate-[vtx-fade_0.3s_ease]">
          {loading ? (
            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-current shrink-0" />
          )}
          <span>{statusMsg}</span>
        </div>
      )}

      <div className="bg-amber-400/[0.04] border border-amber-400/[0.12] rounded-xl px-4 py-3.5">
        <p className="text-xs font-semibold text-amber-400 mb-1">⚠ Lưu ý quan trọng</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          MetaMask sẽ yêu cầu xác nhận giao dịch on-chain. Sau khi blockchain xác nhận, dữ liệu
          sẽ được đồng bộ lên server. Vui lòng đảm bảo bạn đã tải ảnh lên Cloudinary ở Bước 1.
        </p>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className={`
          w-full py-4 rounded-[14px] border-none text-[15px] font-bold tracking-wide
          transition-all duration-200 relative overflow-hidden
          ${
            loading
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white cursor-pointer shadow-[0_8px_32px_rgba(59,130,246,0.2)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:translate-y-0'
          }
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
            Đang xử lý trên Blockchain...
          </span>
        ) : (
          '🚀 Xác nhận phát hành sự kiện'
        )}
      </button>
      <p className="text-center text-[10px] text-slate-800 tracking-wider mt-1">
        Giao dịch yêu cầu xác nhận MetaMask · Gas fee theo mạng Ethereum
      </p>
    </div>
  );
};

export default Step3PaymentPublish;