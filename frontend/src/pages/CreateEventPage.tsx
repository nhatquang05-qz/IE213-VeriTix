import React, { useState, useRef } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { FormInput } from '../components/FormInput';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const labelCls = 'mb-3 flex items-center gap-2 text-base font-semibold text-slate-100';
const requiredDot = <span className="text-rose-400 text-base leading-none">*</span>;

const selectCls =
  'w-full appearance-none cursor-pointer rounded-2xl border border-cyan-400/20 bg-slate-950/80 px-5 py-4 text-base text-white outline-none transition-all duration-200 hover:border-cyan-300/45 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30';

const customInputCls =
  'w-full rounded-2xl border border-cyan-400/20 bg-slate-950/80 px-5 py-4 text-base text-white placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-cyan-300/45 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30';

/* ─── Section wrapper ────────────────────────────────────────────────────── */
const Section = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <section className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-slate-900/70 p-7 shadow-[0_18px_48px_rgba(0,102,255,0.16)] sm:p-10">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
    {title && (
      <h2 className="mb-8 border-b border-slate-700 pb-5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/90">
        {title}
      </h2>
    )}
    <div className="space-y-8">{children}</div>
  </section>
);

/* ─── Image Upload Zone ──────────────────────────────────────────────────── */
const ImageZone = ({
  label,
  hint,
  ratio,
  preview,
  onChange,
}: {
  label: string;
  hint: string;
  ratio: string;
  preview: string | null;
  onChange: (f: File | null) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith('image/')) onChange(f);
  };

  return (
    <div
      className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-cyan-400/25 bg-slate-950/60 transition-all duration-200 hover:border-cyan-300/60 hover:bg-slate-950/80"
      style={{ minHeight: ratio === 'portrait' ? '280px' : '280px' }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => ref.current?.click()}
    >
      {preview ? (
        <>
          <img src={preview} alt={label} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
              Thay ảnh
            </span>
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white">
            Đã chọn
          </div>
        </>
      ) : (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-cyan-300">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 2h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0019.07 5H21a2 2 0 012 2v13a2 2 0 01-2 2H3a2 2 0 01-2-2V7z"
              />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-100">{label}</p>
          <p className="mt-2 text-sm text-slate-400">{hint}</p>
        </div>
      )}

      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="hidden"
      />
    </div>
  );
};

/* ─── Character counter input ────────────────────────────────────────────── */
const CountInput = ({
  name,
  value,
  onChange,
  placeholder,
  max,
  required,
}: {
  name: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  max: number;
  required?: boolean;
}) => (
  <div className="relative">
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={max}
      required={required}
      className={`${customInputCls} pr-24`}
    />
    <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-slate-900 px-2.5 py-1 font-mono text-xs text-slate-300">
      {value.length} / {max}
    </span>
  </div>
);

/* ─── Main Page ──────────────────────────────────────────────────────────── */
const CreateEventPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ticketPrice: '',
    quantity: '',
    resalePercent: '10',
    venueName: '',
    city: '',
    ward: '', // FIX: thêm ward vào state để select được controlled
    address: '',
    category: '',
    eventMode: 'offline' as 'offline' | 'online',
    orgName: '',
    orgInfo: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [orgLogoPreview, setOrgLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'error' | 'success'>('info');

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBannerChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const r = new FileReader();
      r.onloadend = () => setBannerPreview(r.result as string);
      r.readAsDataURL(file);
    } else {
      setBannerPreview(null);
    }
  };

  const handlePosterChange = (file: File | null) => {
    if (file) {
      const r = new FileReader();
      r.onloadend = () => setPosterPreview(r.result as string);
      r.readAsDataURL(file);
    } else {
      setPosterPreview(null);
    }
  };

  const handleOrgLogoChange = (file: File | null) => {
    if (file) {
      const r = new FileReader();
      r.onloadend = () => setOrgLogoPreview(r.result as string);
      r.readAsDataURL(file);
    } else {
      setOrgLogoPreview(null);
    }
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) return alert('Vui lòng cài đặt MetaMask!');
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Bước 1: On-chain
      const priceInWei = ethers.parseEther(formData.ticketPrice);

      // FIX: ép kiểu quantity và resalePercent sang number trước khi gửi lên contract
      const quantityNum = Number(formData.quantity);
      const resaleNum = Number(formData.resalePercent);

      const tx = await contract.createEvent(formData.title, priceInWei, quantityNum, resaleNum);

      setStatus('Đang đợi xác nhận từ mạng lưới...');
      const receipt = await tx.wait();

      // FIX: ethers v6 dùng interface.parseLog() thay vì receipt.logs[0].args
      // Tìm log của sự kiện EventCreated (hoặc tên event tương ứng trong contract)
      let eventId: string | null = null;
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed && parsed.args[0] !== undefined) {
            eventId = parsed.args[0].toString();
            break;
          }
        } catch {
          // log không thuộc contract này, bỏ qua
        }
      }

      if (!eventId) throw new Error('Không lấy được EventID từ transaction receipt.');

      setStatus(`Giao dịch thành công! Event ID: ${eventId}. Đang lưu dữ liệu...`);

      // Bước 2: Off-chain
      const apiData = new FormData();
      apiData.append('description', formData.description);
      if (image) apiData.append('image', image);

      await axios.put(`/api/events/${eventId}`, apiData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatusType('success');
      setStatus('Hoàn tất! Sự kiện của bạn đã sẵn sàng.');
      alert('Tạo sự kiện thành công!');
    } catch (error: any) {
      console.error(error);
      setStatusType('error');
      setStatus(`Lỗi: ${error.reason || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX: thêm min-h-screen để bg phủ toàn màn hình
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(0,212,255,0.06),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(0,102,255,0.08),transparent_40%),linear-gradient(135deg,#0a1628_0%,#1a2742_100%)] font-sans text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex-col text-center">
          <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-7 py-3 shadow-lg shadow-cyan-400/10 transition-all hover:border-cyan-300/60">
            <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">
              NFT Ticketing Platform
            </span>
          </div>

          <h1 className="mb-5 text-5xl font-black tracking-tighter text-white sm:text-6xl">
            Tạo{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Sự Kiện
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-base font-medium leading-8 text-slate-300/90 sm:text-lg sm:leading-9">
            Phát hành vé NFT minh bạch, chống làm giả và đồng bộ dữ liệu hình ảnh/mô tả lên hệ thống
            một cách an toàn nhất.
          </p>
        </div>

        {/* Status */}
        {status && (
          <div
            className={`mb-10 rounded-2xl border px-6 py-5 text-base ${
              statusType === 'error'
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                : statusType === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-cyan-400/35 bg-cyan-500/10 text-cyan-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {loading ? (
                <svg className="h-4 w-4 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-20"
                  />
                  <path
                    d="M22 12A10 10 0 0012 2"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-90"
                  />
                </svg>
              ) : (
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-current" />
              )}
              <span>{status}</span>
            </div>
          </div>
        )}

        {/* */}
        <form onSubmit={handleSubmit} className="w-full space-y-8 sm:space-y-10">
          {/* 1. Upload images */}
          <Section>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
              <label className={labelCls + ' mb-0'}>{requiredDot} Upload hình ảnh</label>
              <button
                type="button"
                className="text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
              >
                Xem vị trí hiển thị các ảnh
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-7">
              <div className="lg:col-span-1">
                <ImageZone
                  label="Thêm ảnh sự kiện"
                  hint="720×958"
                  ratio="portrait"
                  preview={posterPreview}
                  onChange={handlePosterChange}
                />
              </div>

              <div className="lg:col-span-2">
                <ImageZone
                  label="Thêm ảnh nền sự kiện"
                  hint="1280×720"
                  ratio="landscape"
                  preview={bannerPreview}
                  onChange={handleBannerChange}
                />
              </div>
            </div>
          </Section>

          {/* 2. Basic info */}
          <Section>
            <div>
              <label className={labelCls}>{requiredDot} Tên sự kiện</label>
              <CountInput
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Tên sự kiện"
                max={100}
                required
              />
            </div>
          </Section>

          {/* 3. Address */}
          <Section title="Địa chỉ sự kiện">
            <div className="flex flex-wrap gap-4">
              {(['offline', 'online'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFormData({ ...formData, eventMode: m })}
                  className={`rounded-2xl border px-6 py-3.5 text-base font-semibold transition-all ${
                    formData.eventMode === m
                      ? 'border-cyan-300 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/25'
                      : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-cyan-300/50'
                  }`}
                >
                  {m === 'offline' ? 'Offline' : 'Online'}
                </button>
              ))}
            </div>

            {formData.eventMode === 'offline' && (
              <div className="space-y-6 pt-1">
                <div>
                  <label className={labelCls}>{requiredDot} Tên địa điểm</label>
                  <CountInput
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleChange}
                    placeholder="Tên địa điểm"
                    max={80}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:gap-7 md:grid-cols-2">
                  <div>
                    <label className={labelCls}>{requiredDot} Tỉnh/Thành</label>
                    <div className="relative">
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={selectCls}
                      >
                        <option value="">Tỉnh/Thành</option>
                        <option>Hà Nội</option>
                        <option>TP. Hồ Chí Minh</option>
                        <option>Đà Nẵng</option>
                        <option>Cần Thơ</option>
                        <option>Đắk Lắk</option>
                      </select>
                      <svg
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Phường/Xã</label>
                    <div className="relative">
                      {/* FIX: thêm name + value + onChange để select là controlled component */}
                      <select
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        className={selectCls}
                        disabled={!formData.city}
                      >
                        <option value="">Phường/Xã</option>
                      </select>
                      <svg
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{requiredDot} Số nhà, đường</label>
                  <CountInput
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Số nhà, đường"
                    max={80}
                  />
                </div>
              </div>
            )}
          </Section>

          {/* 4. Category */}
          <Section>
            <label className={labelCls}>{requiredDot} Thể loại sự kiện</label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={selectCls}
              >
                <option value="">Vui lòng chọn</option>
                <option>Âm nhạc / Concert</option>
                <option>Thể thao</option>
                <option>Hội nghị / Hội thảo</option>
                <option>Triển lãm</option>
                <option>Gaming / E-sports</option>
                <option>Nghệ thuật</option>
                <option>Khác</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </Section>

          {/* 5. Ticket config */}
          <Section title="Cấu hình vé · On-chain">
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
              <div className="relative">
                <span className="pointer-events-none absolute left-5 top-[52px] z-10 text-base font-bold text-slate-300">
                  Ξ
                </span>
                <FormInput
                  label="Giá vé (ETH)"
                  name="ticketPrice"
                  type="number"
                  step="0.0001"
                  min="0"
                  placeholder="0.05"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  required
                  wrapperClassName="mb-0"
                  inputClassName="pl-9"
                />
              </div>

              <FormInput
                label="Tổng số vé"
                name="quantity"
                type="number"
                min="1"
                placeholder="1000"
                value={formData.quantity}
                onChange={handleChange}
                required
                wrapperClassName="mb-0"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className={labelCls + ' mb-0'}>{requiredDot} Phí bản quyền bán lại</label>
                <span className="text-sm font-semibold text-cyan-300">
                  {formData.resalePercent}% / giao dịch
                </span>
              </div>

              <input
                type="range"
                name="resalePercent"
                min="0"
                max="30"
                step="1"
                value={formData.resalePercent}
                onChange={handleChange}
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
              />

              <div className="mt-3 flex justify-between text-xs text-slate-400">
                <span>0% — Không thu</span>
                <span>30% — Tối đa</span>
              </div>
            </div>
          </Section>

          {/* 6. Description */}
          <Section>
            <label className={labelCls}>{requiredDot} Thông tin sự kiện</label>

            <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/70 shadow-inner shadow-cyan-950/10">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 px-4 py-3.5">
                <select className="rounded-md bg-slate-900/50 px-3 py-2 text-sm text-slate-200 outline-none">
                  <option>Paragraph</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                </select>

                {['B', 'I', 'U'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-md text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <textarea
                name="description"
                rows={7}
                placeholder={`[Tóm tắt ngắn gọn về sự kiện]\n\nChi tiết sự kiện:\n• Chương trình chính: ...\n• Khách mời: ...\n• Trải nghiệm đặc biệt: ...\n\nĐiều khoản và điều kiện:\n[TnC sự kiện]`}
                value={formData.description}
                onChange={handleChange}
                required
                className="min-h-[220px] w-full resize-none bg-transparent px-5 py-5 text-base leading-relaxed text-white placeholder:text-slate-400 outline-none"
              />
            </div>
          </Section>

          {/* 7. Organizer */}
          <Section title="Thông tin ban tổ chức">
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
              <div className="w-full md:w-40">
                <div
                  className="group relative flex h-36 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-dashed border-cyan-400/25 bg-slate-950/60 transition-all hover:border-cyan-300/60"
                  onClick={() => {
                    const inp = document.getElementById('org-logo-input') as HTMLInputElement;
                    inp?.click();
                  }}
                >
                  {orgLogoPreview ? (
                    <>
                      <img
                        src={orgLogoPreview}
                        alt="Logo"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="text-xs font-semibold text-white">Thay logo</span>
                      </div>
                    </>
                  ) : (
                    <div className="px-2 text-center">
                      <p className="text-xs font-medium text-slate-300">Thêm logo</p>
                      <p className="mt-1 text-[11px] text-slate-500">275×275</p>
                    </div>
                  )}

                  <input
                    id="org-logo-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleOrgLogoChange(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="flex-1 space-y-7">
                <div>
                  <label className={labelCls}>{requiredDot} Tên ban tổ chức</label>
                  <CountInput
                    name="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    placeholder="Tên ban tổ chức"
                    max={80}
                  />
                </div>

                <div>
                  <label className={labelCls}>{requiredDot} Thông tin ban tổ chức</label>
                  <div className="relative">
                    <textarea
                      name="orgInfo"
                      rows={4}
                      maxLength={500}
                      placeholder="Thông tin ban tổ chức"
                      value={formData.orgInfo}
                      onChange={handleChange}
                      className={`${customInputCls} resize-none pb-8`}
                    />
                    <span className="absolute bottom-3 right-3 font-mono text-[11px] text-slate-400">
                      {formData.orgInfo.length} / 500
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* 8. Summary + Submit */}
          <Section>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Tóm tắt cấu hình blockchain
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  label: 'Giá vé',
                  value: formData.ticketPrice ? `Ξ ${formData.ticketPrice}` : '—',
                },
                {
                  label: 'Số vé',
                  value: formData.quantity ? Number(formData.quantity).toLocaleString('vi') : '—',
                },
                { label: 'Royalty', value: `${formData.resalePercent}%` },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-cyan-300/15 bg-slate-950/70 px-5 py-5 text-center"
                >
                  <p className="mb-1.5 text-[10px] uppercase tracking-wider text-slate-500">
                    {label}
                  </p>
                  <p className="text-sm font-black text-white">{value}</p>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-2xl px-6 py-5 text-base font-bold transition-all duration-200 ${
                loading
                  ? 'cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-500'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:from-blue-500 hover:to-cyan-400 hover:shadow-cyan-500/30 active:scale-[0.99]'
              }`}
            >
              {loading ? 'Đang xử lý trên Blockchain...' : 'Xác nhận phát hành sự kiện'}
            </button>

            <p className="text-center text-[11px] leading-relaxed text-slate-500">
              Giao dịch yêu cầu xác nhận MetaMask · Gas fee theo mạng Ethereum
            </p>
          </Section>
        </form>

        <p className="mt-10 text-center text-[11px] uppercase tracking-[0.2em] text-slate-600">
          Powered by Ethereum · ERC-721 NFT Standard
        </p>
      </div>
    </div>
  );
};

export default CreateEventPage;
