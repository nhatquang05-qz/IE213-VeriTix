import { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdWarningAmber } from 'react-icons/md';
import { updateEvent } from '../../../services/organizer-event.service';
import { getErrorMessage } from '../../../services/api';
import type { EventDetailContext } from '../../../types/organizer.type';

import { StepIndicator, STEPS } from '../../../components/organizer/CreateEventSteps';
import type { EventFormData } from '../../../components/organizer/CreateEventSteps';
import Step1EventInfo from '../../../components/organizer/Step1EventInfo';
import Step2TicketConfig from '../../../components/organizer/Step2TicketConfig';
import Step3PaymentPublish from '../../../components/organizer/Step3PaymentPublish';

const EMPTY_FORM: EventFormData = {
  name: '',
  category: '',
  locationType: 'offline',
  venueName: '',
  city: '',
  ward: '',
  address: '',
  description: '',
  orgName: '',
  orgInfo: '',
  price: '',
  maxSupply: '',
  resaleRoyalty: 10,
  saleStartDate: '',
  saleStartTime: '09:00',
  saleEndDate: '',
  saleEndTime: '23:59',
  eventStartDate: '',
  eventStartTime: '18:00',
  eventEndDate: '',
  eventEndTime: '22:00',
  earlyBirdPrice: '',
  earlyBirdQty: '',
  vipPrice: '',
  vipQty: '',
};

const splitDateTime = (iso?: string): { date: string; time: string } => {
  if (!iso) return { date: '', time: '' };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: '', time: '' };
  const pad = (n: number) => n.toString().padStart(2, '0');
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
};

export default function EventEditPage() {
  const { event, refetchEvent } = useOutletContext<EventDetailContext>();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<EventFormData>(EMPTY_FORM);

  const [, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    if (!event) return;
    const start = splitDateTime(event.startTime);
    const end = splitDateTime(event.endTime);

    setForm({
      ...EMPTY_FORM,
      name: event.name || '',
      description: event.description || '',
      venueName: event.location || '',
      price: event.price?.toString() || '',
      maxSupply: event.maxSupply?.toString() || '',
      resaleRoyalty: event.maxResellPercentage ?? 10,
      eventStartDate: start.date,
      eventStartTime: start.time || '18:00',
      eventEndDate: end.date,
      eventEndTime: end.time || '22:00',
    });

    if (event.bannerUrl) setBannerPreview(event.bannerUrl);
  }, [event]);

  const set = useCallback(
    (k: keyof EventFormData, v: string | number) => {
      setForm((p) => ({ ...p, [k]: v }));
      if (errors[k])
        setErrors((p) => {
          const n = { ...p };
          delete n[k];
          return n;
        });
    },
    [errors]
  );

  const filePrev = (f: File | null, setF: (f: File | null) => void, setP: (s: string) => void) => {
    setF(f);
    if (f) {
      const r = new FileReader();
      r.onloadend = () => setP(r.result as string);
      r.readAsDataURL(f);
    } else setP('');
  };

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = 'Vui lòng nhập tên sự kiện';
      if (form.locationType === 'offline' && !form.venueName.trim())
        e.venueName = 'Vui lòng nhập địa điểm';
      if (!form.description.trim()) e.description = 'Vui lòng nhập mô tả';
    }
    if (s === 2) {
      if (!form.eventStartDate) e.eventStartDate = 'Chọn ngày sự kiện';
    }
    setErrors(e);
    if (Object.keys(e).length > 0) toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) {
      setStep((s) => Math.min(s + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const prev = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!event?.blockchainId) {
      toast.error('Sự kiện chưa được publish lên blockchain');
      return;
    }

    setSaving(true);
    try {
      const startIso =
        form.eventStartDate && form.eventStartTime
          ? new Date(`${form.eventStartDate}T${form.eventStartTime}`).toISOString()
          : undefined;
      const endIso =
        form.eventEndDate && form.eventEndTime
          ? new Date(`${form.eventEndDate}T${form.eventEndTime}`).toISOString()
          : undefined;

      await updateEvent(event.blockchainId, {
        description: form.description.trim() || undefined,
        location: form.venueName.trim() || undefined,
        startTime: startIso,
        endTime: endIso,
      });

      toast.success('Cập nhật sự kiện thành công!');
      refetchEvent();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!event) return null;

  return (
    <div className="max-w-[880px] mx-auto animate-[vtx-fade_0.35s_ease]">
      <div className="mb-5">
        <h2 className="text-base sm:text-lg font-bold text-white">Chỉnh sửa sự kiện</h2>
        <p className="text-[11.5px] sm:text-[12px] text-slate-600 mt-1 leading-relaxed">
          Cập nhật thông tin sự kiện. Các field on-chain (giá vé, số lượng, phí bán lại) không thể
          thay đổi sau khi đã publish.
        </p>
      </div>

      {/* On-chain warning */}
      <div
        className="
          bg-amber-400/[0.04] border border-amber-400/[0.12] rounded-xl
          px-4 py-3 mb-6 flex items-start gap-3
        "
      >
        <MdWarningAmber size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <p className="text-[11.5px] sm:text-[12px] text-slate-500 leading-relaxed">
          <span className="font-semibold text-amber-400">Lưu ý:</span> Tên, giá vé, số lượng vé và
          phí bản quyền đã ghi trên blockchain — không thể thay đổi. Các trường này sẽ được hiển thị
          readonly bên dưới. Bạn chỉ có thể chỉnh sửa mô tả, địa điểm, ảnh, lịch trình và thông tin
          thanh toán.
        </p>
      </div>

      <StepIndicator
        currentStep={step}
        onStepClick={(s) => {
          if (step > s) setStep(s);
        }}
      />

      <div className="mb-5 md:mb-7 animate-[vtx-fade_0.4s_ease]">
        <h1 className="text-[18px] sm:text-[20px] md:text-[24px] font-extrabold text-white tracking-tight">
          {STEPS[step - 1].label}
        </h1>
        <p className="text-[12.5px] sm:text-[13px] text-slate-600 mt-1.5">
          {step === 1 && 'Cập nhật thông tin cơ bản về sự kiện'}
          {step === 2 && 'Xem lại cấu hình vé (giá, số lượng đã khoá on-chain)'}
          {step === 3 && 'Cập nhật thông tin thanh toán'}
        </p>
      </div>

      {step === 1 && (
        <Step1EventInfo
          form={form}
          errors={errors}
          set={set}
          posterPreview={posterPreview}
          bannerPreview={bannerPreview}
          logoPreview={logoPreview}
          onPoster={(f) => filePrev(f, setPosterFile, setPosterPreview)}
          onBanner={(f) => filePrev(f, setBannerFile, setBannerPreview)}
          onLogo={(f) => filePrev(f, setLogoFile, setLogoPreview)}
        />
      )}
      {step === 2 && <Step2TicketConfig form={form} errors={errors} set={set} />}
      {step === 3 && (
        <Step3PaymentPublish
          form={form}
          errors={errors}
          set={set}
          bannerFile={bannerFile}
          loading={saving}
          statusMsg={saving ? 'Đang cập nhật sự kiện...' : ''}
          onSubmit={handleSubmit}
        />
      )}

      <div
        className={`flex items-center mt-5 md:mt-7 gap-3 ${
          step === 1 ? 'justify-end' : 'justify-between'
        }`}
      >
        {step > 1 && (
          <button
            type="button"
            onClick={prev}
            disabled={saving}
            className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-[10px] bg-transparent border border-white/10 text-slate-500 text-[13px] sm:text-sm font-medium cursor-pointer transition-all duration-200 hover:border-sky-500 hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Quay lại
          </button>
        )}
        {step < 3 && (
          <button
            type="button"
            onClick={next}
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-[10px] bg-sky-500 border-none text-white text-[13px] sm:text-sm font-semibold cursor-pointer transition-all duration-200 shadow-[0_4px_16px_rgba(56,189,248,0.25)] hover:bg-sky-400 hover:-translate-y-0.5"
          >
            Tiếp tục →
          </button>
        )}
      </div>
    </div>
  );
}
