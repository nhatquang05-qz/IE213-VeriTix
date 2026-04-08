import React, { useState, useRef } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { FormInput } from '../components/FormInput';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const labelCls = 'mb-2 flex items-center gap-1 text-sm font-semibold text-slate-200';
const requiredDot = <span className="text-rose-400 text-base leading-none">*</span>;

const selectCls =
  'w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition-all duration-200 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer';

const customInputCls =
  'w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 hover:border-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

/* ─── Section wrapper ────────────────────────────────────────────────────── */
const Section = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm sm:p-6">
    {title && (
      <h2 className="mb-5 border-b border-slate-800 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h2>
    )}
    <div className="space-y-5">{children}</div>
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
      className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 transition-all duration-200 hover:border-blue-500/60 hover:bg-slate-950/70"
      style={{ minHeight: ratio === 'portrait' ? '260px' : '200px' }}
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
        <div className="px-4 py-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-blue-400">
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
          <p className="text-sm font-semibold text-slate-200">{label}</p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
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
      className={`${customInputCls} pr-20`}
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-slate-900 px-2 py-0.5 font-mono text-[11px] text-slate-400">
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

  /* ── Submit — LOGIC GIỮ NGUYÊN ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.ethereum) return alert('Vui lòng cài đặt MetaMask!');
    setLoading(true);
    setStatusType('info');
    setStatus('Đang khởi tạo giao dịch trên Blockchain...');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Bước 1: On-chain
      const priceInWei = ethers.parseEther(formData.ticketPrice);
      const tx = await contract.createEvent(
        formData.title,
        priceInWei,
        formData.quantity,
        formData.resalePercent
      );

      setStatus('Đang đợi xác nhận từ mạng lưới...');
      const receipt = await tx.wait();

      // Lấy Event ID
      const eventId = receipt.logs[0].args[0].toString();
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
    <div className=" bg-slate-950 text-white font-sans">
      <div className="flex w-full justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl">
          {/* Header */}
          <div className="mx-8 p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-3 shadow-lg shadow-blue-500/10">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-400" />
                </span>

                <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                  NFT Ticketing Platform
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Tạo <span className="text-blue-400">Sự Kiện</span>
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Phát hành vé NFT minh bạch, chống làm giả và đồng bộ dữ liệu hình ảnh/mô tả lên hệ
              thống.
            </p>
          </div>

          {/* Status */}
          {status && (
            <div
              className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                statusType === 'error'
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                  : statusType === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-blue-500/30 bg-blue-500/10 text-blue-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {loading ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
                <span>{status}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Upload images */}
            <Section>
              <div className="mb-1 flex items-center justify-between">
                <label className={labelCls}>{requiredDot} Upload hình ảnh</label>
                <button
                  type="button"
                  className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                  Xem vị trí hiển thị các ảnh
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
              <div className="flex flex-wrap gap-2">
                {(['offline', 'online'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({ ...formData, eventMode: m })}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                      formData.eventMode === m
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {m === 'offline' ? 'Offline' : 'Online'}
                  </button>
                ))}
              </div>

              {formData.eventMode === 'offline' && (
                <div className="space-y-4">
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

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <select name="ward" className={selectCls} disabled={!formData.city}>
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-[45px] z-10 text-sm font-bold text-slate-400">
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
                <div className="mb-2 flex items-center justify-between">
                  <label className={labelCls + ' mb-0'}>{requiredDot} Phí bản quyền bán lại</label>
                  <span className="text-xs font-semibold text-blue-400">
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
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-blue-500"
                />

                <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                  <span>0% — Không thu</span>
                  <span>30% — Tối đa</span>
                </div>
              </div>
            </Section>

            {/* 6. Description */}
            <Section>
              <label className={labelCls}>{requiredDot} Thông tin sự kiện</label>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60">
                <div className="flex flex-wrap items-center gap-1 border-b border-slate-800 px-3 py-2">
                  <select className="rounded-md bg-transparent px-2 py-1 text-xs text-slate-300 outline-none">
                    <option>Paragraph</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>

                  {['B', 'I', 'U'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <textarea
                  name="description"
                  rows={7}
                  placeholder={`[Tóm tắt ngắn gọn về sự kiện]

Chi tiết sự kiện:
• Chương trình chính: ...
• Khách mời: ...
• Trải nghiệm đặc biệt: ...

Điều khoản và điều kiện:
[TnC sự kiện]`}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="min-h-[180px] w-full resize-none bg-transparent px-4 py-3 text-sm leading-relaxed text-white placeholder:text-slate-500 outline-none"
                />
              </div>
            </Section>

            {/* 7. Organizer */}
            <Section title="Thông tin ban tổ chức">
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <div className="w-full md:w-32">
                  <div
                    className="group relative flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 transition-all hover:border-blue-500/60"
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

                <div className="flex-1 space-y-4">
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
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Tóm tắt cấu hình blockchain
              </p>

              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                    className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-center"
                  >
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-500">
                      {label}
                    </p>
                    <p className="text-sm font-black text-white">{value}</p>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-2xl px-5 py-4 text-sm font-bold transition-all duration-200 ${
                  loading
                    ? 'cursor-not-allowed border border-slate-700 bg-slate-800 text-slate-500'
                    : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500'
                }`}
              >
                {loading ? 'Đang xử lý trên Blockchain...' : 'Xác nhận phát hành sự kiện'}
              </button>

              <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
                Giao dịch yêu cầu xác nhận MetaMask · Gas fee theo mạng Ethereum
              </p>
            </Section>
          </form>

          <p className="mt-8 text-center text-[11px] uppercase tracking-[0.2em] text-slate-600">
            Powered by Ethereum · ERC-721 NFT Standard
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
