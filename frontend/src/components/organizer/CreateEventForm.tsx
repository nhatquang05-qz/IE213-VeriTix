import React, { useState, useRef, useCallback } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/* ══════════════════════════════════════════
   CreateEventForm — Futuristic Blockchain UI
   Veritix · Syne + DM Sans · Dark Glassmorphism
   ══════════════════════════════════════════ */

const API_URL = import.meta.env.VITE_API_URL || '';
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

const CREATE_EVENT_ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'uint256', name: 'price', type: 'uint256' },
      { internalType: 'uint256', name: 'maxSupply', type: 'uint256' },
      { internalType: 'uint256', name: 'maxResellPercentage', type: 'uint256' },
    ],
    name: 'createEvent',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'eventId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'address', name: 'organizer', type: 'address' },
    ],
    name: 'EventCreated',
    type: 'event',
  },
] as const;

type FormState = {
  name: string;
  price: string;
  maxSupply: string;
  maxResellPercentage: number;
  description: string;
  category: string;
  locationType: 'offline' | 'online';
  venueName: string;
  city: string;
  address: string;
  orgName: string;
  orgInfo: string;
};

type Props = { isMobile: boolean };

/* ── Icons ── */
const CameraIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 2h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0019.07 5H21a2 2 0 012 2v13a2 2 0 01-2 2H3a2 2 0 01-2-2V7z"
    />
    <circle cx="12" cy="13" r="3" />
  </svg>
);
const ImageIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15l4-4 4 4 4-5 4 5" />
  </svg>
);

/* ══════════════════════════════════════════ */

const CreateEventForm: React.FC<Props> = ({ isMobile }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');

  const [form, setForm] = useState<FormState>({
    name: '',
    price: '',
    maxSupply: '',
    maxResellPercentage: 10,
    description: '',
    category: '',
    locationType: 'offline',
    venueName: '',
    city: '',
    address: '',
    orgName: '',
    orgInfo: '',
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  const posterRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const set = useCallback((field: keyof FormState, value: string | number) => {
    setForm((p) => ({ ...p, [field]: value }));
  }, []);

  const handleFilePreview = (
    file: File | null,
    setFile: (f: File | null) => void,
    setPreview: (s: string) => void
  ) => {
    setFile(file);
    if (file) {
      const r = new FileReader();
      r.onloadend = () => setPreview(r.result as string);
      r.readAsDataURL(file);
    } else setPreview('');
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.ethereum) {
      toast.error('Vui lòng cài đặt MetaMask!');
      return;
    }
    if (!CONTRACT_ADDRESS) {
      toast.error('Contract address chưa cấu hình. Kiểm tra .env');
      return;
    }
    if (!form.name.trim()) {
      toast.error('Vui lòng nhập tên sự kiện');
      return;
    }

    try {
      setLoading(true);
      setStatusType('info');
      setStatusMsg('Đang khởi tạo giao dịch trên Blockchain...');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CREATE_EVENT_ABI, signer);
      const priceInWei = ethers.parseEther(form.price || '0');

      setStatusMsg('Đang gửi giao dịch — vui lòng xác nhận trên MetaMask...');
      const tx = await contract.createEvent(
        form.name,
        priceInWei,
        Number(form.maxSupply || 0),
        Number(form.maxResellPercentage)
      );

      setStatusMsg('Đang đợi xác nhận từ mạng lưới...');
      const receipt = await tx.wait();

      let eventId: string | null = null;
      const iface = new ethers.Interface(CREATE_EVENT_ABI);
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog({ topics: log.topics as string[], data: log.data });
          if (parsed?.name === 'EventCreated') {
            eventId = parsed.args.eventId.toString();
            break;
          }
        } catch {
          /* skip */
        }
      }

      setStatusType('success');
      setStatusMsg(`On-chain thành công! Event ID: ${eventId || 'N/A'}`);
      toast.success('Tạo sự kiện on-chain thành công!');

      if (eventId && (bannerFile || posterFile || form.description)) {
        setStatusMsg('Đang upload dữ liệu lên server...');
        const fd = new FormData();
        if (bannerFile) fd.append('banner', bannerFile);
        if (posterFile) fd.append('poster', posterFile);
        if (logoFile) fd.append('logo', logoFile);
        fd.append('description', form.description);
        fd.append('category', form.category);
        fd.append('orgName', form.orgName);
        fd.append('orgInfo', form.orgInfo);

        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const apiRes = await fetch(`${API_URL}/api/events/${eventId}`, {
          method: 'PUT',
          headers,
          body: fd,
        });
        if (!apiRes.ok) throw new Error(`API lỗi HTTP ${apiRes.status}`);
        toast.success('Upload dữ liệu thành công!');
      }

      setTimeout(() => navigate('/organizer-dashboard'), 1500);
    } catch (err: any) {
      setStatusType('error');
      const msg = err?.reason || err?.message || 'Đã xảy ra lỗi';
      setStatusMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Shared styles ── */
  const card: React.CSSProperties = {
    background: '#0e1422',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: isMobile ? '20px 16px' : '24px',
    transition: 'border-color 0.18s',
  };
  const cardTitle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: '#64748b',
    paddingBottom: 14,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    marginBottom: 20,
  };
  const label: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 500,
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginBottom: 7,
  };
  const req: React.CSSProperties = { color: '#f43f5e', fontSize: 15, lineHeight: 1 };
  const input: React.CSSProperties = {
    width: '100%',
    background: '#0a0e1a',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '11px 16px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: '#f1f5f9',
    outline: 'none',
    transition: 'border-color 0.18s, box-shadow 0.18s',
  };
  const focusStyle = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.target.style.borderColor = '#3b82f6';
    e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.18)';
  };
  const blurStyle = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.12)';
    e.target.style.boxShadow = 'none';
  };

  const uploadZone = (preview: string, isPortrait: boolean): React.CSSProperties => ({
    border: '1.5px dashed rgba(255,255,255,0.12)',
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    minHeight: isPortrait ? 240 : 160,
    padding: '24px 16px',
    gap: 10,
    transition: 'border-color 0.18s, background 0.18s',
    background: preview ? 'transparent' : 'rgba(59,130,246,0.02)',
  });

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* ── Status Bar ── */}
      {statusMsg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 18px',
            borderRadius: 10,
            fontSize: 13,
            border: `1px solid ${statusType === 'error' ? 'rgba(244,63,94,0.3)' : statusType === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`,
            background:
              statusType === 'error'
                ? 'rgba(244,63,94,0.08)'
                : statusType === 'success'
                  ? 'rgba(16,185,129,0.08)'
                  : 'rgba(59,130,246,0.08)',
            color:
              statusType === 'error' ? '#fda4af' : statusType === 'success' ? '#6ee7b7' : '#93c5fd',
            animation: 'vtx-fade-up 0.3s ease',
          }}
        >
          {loading ? (
            <div
              style={{
                width: 14,
                height: 14,
                border: '2px solid currentColor',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'vtx-spin 0.7s linear infinite',
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'currentColor',
                flexShrink: 0,
              }}
            />
          )}
          <span>{statusMsg}</span>
        </div>
      )}

      {/* ═══ 1. Upload ảnh ═══ */}
      <div
        style={card}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <span style={label}>
            <span style={req}>*</span> Upload hình ảnh
          </span>
          <span style={{ fontSize: 12, color: '#60a5fa', cursor: 'pointer' }}>
            Xem vị trí hiển thị
          </span>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: 16 }}
        >
          {/* Poster */}
          <div
            style={uploadZone(posterPreview, true)}
            onClick={() => posterRef.current?.click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
              e.currentTarget.style.background = 'rgba(59,130,246,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.background = posterPreview
                ? 'transparent'
                : 'rgba(59,130,246,0.02)';
            }}
          >
            {posterPreview ? (
              <>
                <img
                  src={posterPreview}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 16,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: '#10b981',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 999,
                    pointerEvents: 'none',
                  }}
                >
                  Đã chọn
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.18s',
                    pointerEvents: 'none',
                  }}
                  className="uz-hover"
                >
                  <span
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(6px)',
                      borderRadius: 999,
                      padding: '6px 18px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#fff',
                    }}
                  >
                    Thay ảnh
                  </span>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa',
                  }}
                >
                  <CameraIcon />
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#cbd5e1' }}>Ảnh sự kiện</p>
                <small
                  style={{ fontSize: 11, color: '#64748b', fontFamily: "'DM Mono', monospace" }}
                >
                  720 × 958
                </small>
              </>
            )}
            <input
              ref={posterRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                handleFilePreview(e.target.files?.[0] ?? null, setPosterFile, setPosterPreview)
              }
            />
          </div>

          {/* Banner */}
          <div
            style={uploadZone(bannerPreview, false)}
            onClick={() => bannerRef.current?.click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
              e.currentTarget.style.background = 'rgba(59,130,246,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.background = bannerPreview
                ? 'transparent'
                : 'rgba(59,130,246,0.02)';
            }}
          >
            {bannerPreview ? (
              <>
                <img
                  src={bannerPreview}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 16,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: '#10b981',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 999,
                  }}
                >
                  Đã chọn
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa',
                  }}
                >
                  <ImageIcon />
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#cbd5e1' }}>Ảnh nền sự kiện</p>
                <small
                  style={{ fontSize: 11, color: '#64748b', fontFamily: "'DM Mono', monospace" }}
                >
                  1280 × 720
                </small>
              </>
            )}
            <input
              ref={bannerRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                handleFilePreview(e.target.files?.[0] ?? null, setBannerFile, setBannerPreview)
              }
            />
          </div>
        </div>
      </div>

      {/* ═══ 2. Tên sự kiện ═══ */}
      <div style={card}>
        <span style={label}>
          <span style={req}>*</span> Tên sự kiện
        </span>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            maxLength={100}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Nhập tên sự kiện"
            style={{ ...input, paddingRight: 70 }}
            onFocus={focusStyle}
            onBlur={blurStyle}
            required
          />
          <span
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 11,
              color: '#64748b',
              pointerEvents: 'none',
              background: '#0a0e1a',
              padding: '2px 6px',
              borderRadius: 5,
            }}
          >
            {form.name.length} / 100
          </span>
        </div>
      </div>

      {/* ═══ 3. Thể loại ═══ */}
      <div style={card}>
        <span style={label}>
          <span style={req}>*</span> Thể loại sự kiện
        </span>
        <div style={{ position: 'relative' }}>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            style={{ ...input, cursor: 'pointer', paddingRight: 40, appearance: 'none' as const }}
            onFocus={focusStyle as any}
            onBlur={blurStyle as any}
            required
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
          <div
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #64748b',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* ═══ 4. Địa chỉ ═══ */}
      <div style={card}>
        <div style={cardTitle}>Địa chỉ sự kiện</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['offline', 'online'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => set('locationType', m)}
              style={{
                padding: '8px 20px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.18s',
                border:
                  form.locationType === m
                    ? '1px solid #3b82f6'
                    : '1px solid rgba(255,255,255,0.12)',
                background: form.locationType === m ? '#3b82f6' : 'transparent',
                color: form.locationType === m ? '#fff' : '#64748b',
              }}
            >
              {m === 'offline' ? 'Offline' : 'Online'}
            </button>
          ))}
        </div>
        {form.locationType === 'offline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <span style={label}>
                <span style={req}>*</span> Tên địa điểm
              </span>
              <input
                type="text"
                maxLength={80}
                value={form.venueName}
                onChange={(e) => set('venueName', e.target.value)}
                placeholder="Ví dụ: Nhà hát Lớn Hà Nội"
                style={input}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 16,
              }}
            >
              <div>
                <span style={label}>
                  <span style={req}>*</span> Tỉnh/Thành
                </span>
                <select
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  style={{ ...input, cursor: 'pointer', appearance: 'none' as const }}
                  onFocus={focusStyle as any}
                  onBlur={blurStyle as any}
                >
                  <option value="">Chọn tỉnh/thành</option>
                  <option>Hà Nội</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Đà Nẵng</option>
                  <option>Cần Thơ</option>
                </select>
              </div>
              <div>
                <span style={label}>Phường/Xã</span>
                <select
                  disabled={!form.city}
                  style={{
                    ...input,
                    cursor: form.city ? 'pointer' : 'not-allowed',
                    opacity: form.city ? 1 : 0.4,
                    appearance: 'none' as const,
                  }}
                  onFocus={focusStyle as any}
                  onBlur={blurStyle as any}
                >
                  <option value="">Phường/Xã</option>
                </select>
              </div>
            </div>
            <div>
              <span style={label}>
                <span style={req}>*</span> Số nhà, đường
              </span>
              <input
                type="text"
                maxLength={80}
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder="Ví dụ: 01 Tràng Tiền, Hoàn Kiếm"
                style={input}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
          </div>
        )}
      </div>

      {/* ═══ 5. Cấu hình vé On-chain ═══ */}
      <div style={card}>
        <div style={cardTitle}>Cấu hình vé · On-chain</div>
        <div
          style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}
        >
          <div>
            <span style={label}>
              <span style={req}>*</span> Giá vé (ETH)
            </span>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#64748b',
                  pointerEvents: 'none',
                }}
              >
                Ξ
              </span>
              <input
                type="number"
                step="0.0001"
                min="0"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0.05"
                style={{ ...input, paddingLeft: 30 }}
                onFocus={focusStyle}
                onBlur={blurStyle}
                required
              />
            </div>
          </div>
          <div>
            <span style={label}>
              <span style={req}>*</span> Tổng số vé
            </span>
            <input
              type="number"
              min="1"
              value={form.maxSupply}
              onChange={(e) => set('maxSupply', e.target.value)}
              placeholder="1000"
              style={input}
              onFocus={focusStyle}
              onBlur={blurStyle}
              required
            />
          </div>
        </div>
        {/* Range slider */}
        <div style={{ marginTop: 22 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <span style={label}>
              <span style={req}>*</span> Phí bản quyền bán lại
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#60a5fa' }}>
              {form.maxResellPercentage}% / giao dịch
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={form.maxResellPercentage}
            onChange={(e) => set('maxResellPercentage', Number(e.target.value))}
            style={{
              width: '100%',
              height: 4,
              borderRadius: 99,
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(form.maxResellPercentage / 30) * 100}%, #334155 ${(form.maxResellPercentage / 30) * 100}%, #334155 100%)`,
              WebkitAppearance: 'none',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              color: '#64748b',
              marginTop: 8,
            }}
          >
            <span>0% — Không thu</span>
            <span>30% — Tối đa</span>
          </div>
        </div>
      </div>

      {/* ═══ 6. Mô tả ═══ */}
      <div style={card}>
        <span style={label}>
          <span style={req}>*</span> Thông tin sự kiện
        </span>
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            overflow: 'hidden',
            transition: 'border-color 0.18s, box-shadow 0.18s',
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 4,
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {['B', 'I', 'U'].map((b) => (
              <button
                key={b}
                type="button"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  border: '1px solid transparent',
                  background: 'transparent',
                  color: '#64748b',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: b === 'B' ? 700 : 400,
                  fontStyle: b === 'I' ? 'italic' : 'normal',
                  textDecoration: b === 'U' ? 'underline' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.18s',
                }}
              >
                {b}
              </button>
            ))}
          </div>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={8}
            placeholder={`[Tóm tắt ngắn gọn về sự kiện]\n\nChi tiết sự kiện:\n• Chương trình chính: ...\n• Khách mời: ...\n• Trải nghiệm đặc biệt: ...\n\nĐiều khoản và điều kiện:\n[TnC sự kiện]`}
            style={{
              ...input,
              border: 'none',
              borderRadius: 0,
              minHeight: 160,
              resize: 'vertical',
              lineHeight: 1.65,
            }}
            onFocus={(e) => {
              e.target.parentElement!.style.borderColor = '#3b82f6';
              e.target.parentElement!.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.18)';
            }}
            onBlur={(e) => {
              e.target.parentElement!.style.borderColor = 'rgba(255,255,255,0.12)';
              e.target.parentElement!.style.boxShadow = 'none';
            }}
            required
          />
        </div>
      </div>

      {/* ═══ 7. Ban tổ chức ═══ */}
      <div style={card}>
        <div style={cardTitle}>Thông tin ban tổ chức</div>
        <div
          style={{
            display: 'flex',
            gap: 20,
            alignItems: 'flex-start',
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          {/* Logo */}
          <div
            onClick={() => logoRef.current?.click()}
            style={{
              width: 96,
              height: 96,
              minWidth: 96,
              border: '1.5px dashed rgba(255,255,255,0.12)',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              textAlign: 'center',
              gap: 5,
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.18s, background 0.18s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
              e.currentTarget.style.background = 'rgba(59,130,246,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 14,
                }}
              />
            ) : (
              <>
                <p style={{ fontSize: 11, fontWeight: 500, color: '#94a3b8' }}>Thêm logo</p>
                <small style={{ fontSize: 10, color: '#64748b' }}>275 × 275</small>
              </>
            )}
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                handleFilePreview(e.target.files?.[0] ?? null, setLogoFile, setLogoPreview)
              }
            />
          </div>
          {/* Fields */}
          <div
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}
          >
            <div>
              <span style={label}>
                <span style={req}>*</span> Tên ban tổ chức
              </span>
              <input
                type="text"
                maxLength={80}
                value={form.orgName}
                onChange={(e) => set('orgName', e.target.value)}
                placeholder="Tên ban tổ chức"
                style={input}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
            <div>
              <span style={label}>
                <span style={req}>*</span> Thông tin ban tổ chức
              </span>
              <div style={{ position: 'relative' }}>
                <textarea
                  maxLength={500}
                  value={form.orgInfo}
                  onChange={(e) => set('orgInfo', e.target.value)}
                  rows={4}
                  placeholder="Mô tả ngắn về ban tổ chức..."
                  style={{ ...input, resize: 'vertical', lineHeight: 1.65, paddingBottom: 30 }}
                  onFocus={focusStyle as any}
                  onBlur={blurStyle as any}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: 12,
                    bottom: 10,
                    fontSize: 11,
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                >
                  {form.orgInfo.length} / 500
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 8. Summary + Submit ═══ */}
      <div style={card}>
        <p style={cardTitle}>Tóm tắt cấu hình blockchain</p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            { l: 'Giá vé', v: form.price ? `Ξ ${parseFloat(form.price).toFixed(4)}` : '—' },
            { l: 'Số vé', v: form.maxSupply ? parseInt(form.maxSupply).toLocaleString('vi') : '—' },
            { l: 'Royalty', v: `${form.maxResellPercentage}%` },
          ].map((s) => (
            <div
              key={s.l}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
                padding: '14px 16px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#64748b',
                  marginBottom: 5,
                }}
              >
                {s.l}
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#f1f5f9',
                }}
              >
                {s.v}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px 24px',
            borderRadius: 16,
            background: loading ? '#334155' : '#3b82f6',
            color: loading ? '#64748b' : '#fff',
            border: 'none',
            fontFamily: "'Syne', sans-serif",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '0.02em',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.18s',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {loading ? 'Đang xử lý trên Blockchain...' : 'Xác nhận phát hành sự kiện'}
        </button>
        <p
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: '#334155',
            marginTop: 10,
            letterSpacing: '0.04em',
          }}
        >
          Giao dịch yêu cầu xác nhận MetaMask · Gas fee theo mạng Ethereum
        </p>
      </div>
    </form>
  );
};

export default CreateEventForm;
