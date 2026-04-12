import React, { useRef } from 'react';

/* ══════════════════════════════════════════
   CreateEvent — Step Components
   Veritix · React + Tailwind v4
   ══════════════════════════════════════════ */

/* ── Types ── */
export type EventFormData = {
  name: string;
  price: string;
  maxSupply: string;
  maxResellPercentage: string;
  description: string;
  bannerFile: File | null;
  bannerPreview: string;
  thumbnailFile: File | null;
  thumbnailPreview: string;
};

type StepProps = {
  form: EventFormData;
  onChange: (field: keyof EventFormData, value: string | File | null) => void;
  errors: Partial<Record<keyof EventFormData, string>>;
};

/* ── Step config ── */
export const STEPS = [
  { id: 1, label: 'Thông tin sự kiện' },
  { id: 2, label: 'Hình ảnh & Mô tả' },
  { id: 3, label: 'Xác nhận & Tạo' },
];

/* ══════════════════════════════════════════
   StepIndicator — Thanh tiến trình
   ══════════════════════════════════════════ */
export const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      background: '#111827',
      border: '1px solid rgba(99,179,237,0.12)',
      borderRadius: 12,
      padding: '14px 20px',
      overflowX: 'auto',
    }}
  >
    {STEPS.map((step, i) => {
      const isActive = currentStep === step.id;
      const isDone = currentStep > step.id;
      return (
        <React.Fragment key={step.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                transition: 'all 0.3s ease',
                background: isDone ? '#34d399' : isActive ? '#38bdf8' : 'rgba(99,179,237,0.1)',
                color: isDone || isActive ? '#0b1120' : '#94a3b8',
              }}
            >
              {isDone ? '✓' : step.id}
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#f1f5f9' : isDone ? '#34d399' : '#94a3b8',
                whiteSpace: 'nowrap',
              }}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 1,
                minWidth: 24,
                margin: '0 12px',
                background: isDone ? '#34d399' : 'rgba(99,179,237,0.15)',
                transition: 'background 0.3s ease',
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ══════════════════════════════════════════
   Step 1 — Thông tin sự kiện
   ══════════════════════════════════════════ */
export const Step1EventInfo: React.FC<StepProps> = ({ form, onChange, errors }) => {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0b1120',
    border: '1px solid rgba(99,179,237,0.22)',
    borderRadius: 9,
    padding: '11px 14px',
    fontSize: 14,
    color: '#f1f5f9',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: "'Be Vietnam Pro', sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#f1f5f9',
    marginBottom: 6,
  };

  const errorStyle: React.CSSProperties = {
    fontSize: 11,
    color: '#f87171',
    marginTop: 4,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tên sự kiện */}
      <div>
        <label style={labelStyle}>
          <span style={{ color: '#f87171', marginRight: 4 }}>*</span>Tên sự kiện
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="VD: Blockchain Summit Vietnam 2026"
          style={{
            ...inputStyle,
            borderColor: errors.name ? '#f87171' : 'rgba(99,179,237,0.22)',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
          onBlur={(e) =>
            (e.target.style.borderColor = errors.name ? '#f87171' : 'rgba(99,179,237,0.22)')
          }
        />
        {errors.name && <p style={errorStyle}>{errors.name}</p>}
      </div>

      {/* Giá vé + Số lượng (2 cột) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>
            <span style={{ color: '#f87171', marginRight: 4 }}>*</span>Giá vé (ETH)
          </label>
          <input
            type="number"
            step="0.00001"
            min="0"
            value={form.price}
            onChange={(e) => onChange('price', e.target.value)}
            placeholder="0.01"
            style={{
              ...inputStyle,
              borderColor: errors.price ? '#f87171' : 'rgba(99,179,237,0.22)',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
            onBlur={(e) =>
              (e.target.style.borderColor = errors.price ? '#f87171' : 'rgba(99,179,237,0.22)')
            }
          />
          {errors.price && <p style={errorStyle}>{errors.price}</p>}
        </div>
        <div>
          <label style={labelStyle}>
            <span style={{ color: '#f87171', marginRight: 4 }}>*</span>Số lượng vé
          </label>
          <input
            type="number"
            min="1"
            value={form.maxSupply}
            onChange={(e) => onChange('maxSupply', e.target.value)}
            placeholder="100"
            style={{
              ...inputStyle,
              borderColor: errors.maxSupply ? '#f87171' : 'rgba(99,179,237,0.22)',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
            onBlur={(e) =>
              (e.target.style.borderColor = errors.maxSupply ? '#f87171' : 'rgba(99,179,237,0.22)')
            }
          />
          {errors.maxSupply && <p style={errorStyle}>{errors.maxSupply}</p>}
        </div>
      </div>

      {/* % Bán lại tối đa */}
      <div>
        <label style={labelStyle}>Giá bán lại tối đa (%)</label>
        <input
          type="number"
          min="100"
          max="200"
          value={form.maxResellPercentage}
          onChange={(e) => onChange('maxResellPercentage', e.target.value)}
          placeholder="110"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(99,179,237,0.22)')}
        />
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
          Phần trăm giá gốc cho phép bán lại. VD: 110 = tối đa 110% giá gốc.
        </p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   Step 2 — Hình ảnh & Mô tả
   ══════════════════════════════════════════ */
export const Step2Media: React.FC<StepProps> = ({ form, onChange, errors }) => {
  const bannerRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const handleFile = (
    field: 'bannerFile' | 'thumbnailFile',
    previewField: 'bannerPreview' | 'thumbnailPreview',
    file: File | null
  ) => {
    onChange(field, file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange(previewField, reader.result as string);
      reader.readAsDataURL(file);
    } else {
      onChange(previewField, '');
    }
  };

  const uploadBoxStyle = (hasPreview: boolean): React.CSSProperties => ({
    width: '100%',
    aspectRatio: hasPreview ? undefined : undefined,
    minHeight: hasPreview ? 180 : 200,
    border: '2px dashed rgba(99,179,237,0.25)',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'border-color 0.15s, background 0.15s',
    background: hasPreview ? 'transparent' : 'rgba(99,179,237,0.03)',
    position: 'relative',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Upload ảnh */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 12 }}>
          <span style={{ color: '#f87171', marginRight: 4 }}>*</span>Upload hình ảnh
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Banner */}
          <div>
            <div
              style={uploadBoxStyle(!!form.bannerPreview)}
              onClick={() => bannerRef.current?.click()}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(99,179,237,0.25)')}
            >
              {form.bannerPreview ? (
                <img
                  src={form.bannerPreview}
                  alt="Banner"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0.6, marginBottom: 8 }}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                    Ảnh nền sự kiện
                  </p>
                  <p style={{ fontSize: 11, color: '#64748b' }}>(1280×720)</p>
                </>
              )}
            </div>
            <input
              ref={bannerRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                handleFile('bannerFile', 'bannerPreview', e.target.files?.[0] ?? null)
              }
            />
            {errors.bannerFile && (
              <p style={{ fontSize: 11, color: '#f87171', marginTop: 4 }}>{errors.bannerFile}</p>
            )}
          </div>

          {/* Thumbnail */}
          <div>
            <div
              style={uploadBoxStyle(!!form.thumbnailPreview)}
              onClick={() => thumbRef.current?.click()}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(99,179,237,0.25)')}
            >
              {form.thumbnailPreview ? (
                <img
                  src={form.thumbnailPreview}
                  alt="Thumbnail"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0.6, marginBottom: 8 }}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                    Ảnh đại diện
                  </p>
                  <p style={{ fontSize: 11, color: '#64748b' }}>(720×958)</p>
                </>
              )}
            </div>
            <input
              ref={thumbRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                handleFile('thumbnailFile', 'thumbnailPreview', e.target.files?.[0] ?? null)
              }
            />
          </div>
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: '#f1f5f9',
            marginBottom: 6,
          }}
        >
          Mô tả sự kiện
        </label>
        <textarea
          value={form.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Mô tả chi tiết về sự kiện của bạn..."
          rows={6}
          style={{
            width: '100%',
            background: '#0b1120',
            border: '1px solid rgba(99,179,237,0.22)',
            borderRadius: 9,
            padding: '11px 14px',
            fontSize: 14,
            color: '#f1f5f9',
            outline: 'none',
            resize: 'vertical',
            fontFamily: "'Be Vietnam Pro', sans-serif",
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(99,179,237,0.22)')}
        />
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, textAlign: 'right' }}>
          {form.description.length} / 2000
        </p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   Step 3 — Xác nhận tổng quan
   ══════════════════════════════════════════ */
export const Step3Review: React.FC<{ form: EventFormData; loadingStep: string }> = ({
  form,
  loadingStep,
}) => {
  const row = (label: string, value: string) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid rgba(99,179,237,0.08)',
      }}
    >
      <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#f1f5f9',
          textAlign: 'right',
          maxWidth: '60%',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tổng quan */}
      <div
        style={{
          background: '#0b1120',
          borderRadius: 12,
          padding: '16px 20px',
          border: '1px solid rgba(99,179,237,0.12)',
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 600, color: '#38bdf8', marginBottom: 8 }}>
          Tổng quan sự kiện
        </p>
        {row('Tên sự kiện', form.name || '—')}
        {row('Giá vé', form.price ? `${form.price} ETH` : 'Miễn phí')}
        {row('Số lượng vé', form.maxSupply || '—')}
        {row('Giá bán lại tối đa', `${form.maxResellPercentage}%`)}
        {row('Ảnh nền', form.bannerFile ? form.bannerFile.name : 'Chưa upload')}
        {row('Mô tả', form.description ? `${form.description.substring(0, 80)}...` : 'Không có')}
      </div>

      {/* Tiến trình tạo */}
      {loadingStep && (
        <div
          style={{
            background: 'rgba(56,189,248,0.06)',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1px solid rgba(56,189,248,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 20,
                height: 20,
                border: '2.5px solid rgba(56,189,248,0.2)',
                borderTopColor: '#38bdf8',
                borderRadius: '50%',
                animation: 'vtx-spin 0.7s linear infinite',
              }}
            />
            <span style={{ fontSize: 13, color: '#38bdf8', fontWeight: 500 }}>{loadingStep}</span>
          </div>
        </div>
      )}

      {/* Lưu ý */}
      <div
        style={{
          background: 'rgba(251,191,36,0.06)',
          borderRadius: 12,
          padding: '14px 18px',
          border: '1px solid rgba(251,191,36,0.15)',
        }}
      >
        <p style={{ fontSize: 12, color: '#fbbf24', fontWeight: 500, marginBottom: 4 }}>⚠ Lưu ý</p>
        <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
          Khi bấm "Tạo sự kiện", MetaMask sẽ yêu cầu bạn xác nhận giao dịch trên blockchain. Sau khi
          giao dịch thành công, ảnh và mô tả sẽ được lưu lên server.
        </p>
      </div>
    </div>
  );
};
