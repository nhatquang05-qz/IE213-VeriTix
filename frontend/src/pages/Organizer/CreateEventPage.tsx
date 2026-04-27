import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { StepIndicator, STEPS } from '../../components/organizer/CreateEventSteps';
import type { EventFormData } from '../../components/organizer/CreateEventSteps';
import Step1EventInfo from '../../components/organizer/Step1EventInfo';
import Step2TicketConfig from '../../components/organizer/Step2TicketConfig';
import Step3PaymentPublish from '../../components/organizer/Step3PaymentPublish';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config/contract';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<EventFormData>({
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
    vipQty: ''
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [uploadedBannerUrl, setUploadedBannerUrl] = useState('');

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

  const handleUploadBanner = async () => {
    if (!bannerFile) {
      toast.warning('Vui lòng chọn file ảnh Banner trước!');
      return;
    }
    try {
      setIsUploadingBanner(true);
      const formData = new FormData();
      formData.append('image', bannerFile);

      const tk = localStorage.getItem('token');
      // SỬA Ở ĐÂY: Xóa /api để tránh lặp /api/api
      const res = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${tk}` },
        body: formData
      });

      if (!res.ok) throw new Error('Lỗi khi tải ảnh lên Cloudinary');
      
      const data = await res.json();
      setUploadedBannerUrl(data.imageUrl); 
      toast.success('Tải ảnh lên Cloudinary thành công!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploadingBanner(false);
    }
  };

  useEffect(() => {
    const b = document.body,
      r = document.getElementById('root');
    const p = {
      bg: b.style.backgroundColor,
      c: b.style.color,
      mw: r?.style.maxWidth || '',
      m: r?.style.margin || '',
      pd: r?.style.padding || '',
      ta: r?.style.textAlign || '',
    };
    b.style.backgroundColor = '#070a11';
    b.style.color = '#f1f5f9';
    if (r) {
      r.style.maxWidth = 'none';
      r.style.margin = '0';
      r.style.padding = '0';
      r.style.textAlign = 'left';
    }
    return () => {
      b.style.backgroundColor = p.bg;
      b.style.color = p.c;
      if (r) {
        r.style.maxWidth = p.mw;
        r.style.margin = p.m;
        r.style.padding = p.pd;
        r.style.textAlign = p.ta;
      }
    };
  }, []);

  useEffect(() => {
    const ck = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      if (w < 768) setSidebarExpanded(true);
      if (w >= 768 && w < 1024) setSidebarExpanded(false);
      if (w >= 1024) setSidebarExpanded(true);
    };
    ck();
    window.addEventListener('resize', ck);
    return () => window.removeEventListener('resize', ck);
  }, []);

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = 'Vui lòng nhập tên sự kiện';
      if (!form.category) e.category = 'Vui lòng chọn thể loại';
      if (form.locationType === 'offline' && !form.venueName.trim())
        e.venueName = 'Vui lòng nhập địa điểm';
      if (!form.description.trim()) e.description = 'Vui lòng nhập mô tả';
    }
    if (s === 2) {
      if (!form.price && form.price !== '0') e.price = 'Vui lòng nhập giá vé';
      if (!form.maxSupply) e.maxSupply = 'Vui lòng nhập số lượng';
      if (!form.saleStartDate) e.saleStartDate = 'Chọn ngày bắt đầu bán';
      if (!form.saleEndDate) e.saleEndDate = 'Chọn ngày kết thúc bán';
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
    if (!window.ethereum) {
      toast.error('Vui lòng cài MetaMask!');
      return;
    }
    if (!CONTRACT_ADDRESS) {
      toast.error('Chưa cấu hình địa chỉ Contract!');
      return;
    }
    if (!uploadedBannerUrl) {
      toast.error('Vui lòng Tải ảnh Banner lên Cloudinary ở Bước 1 trước khi phát hành!');
      return;
    }

    try {
      setLoading(true);
      setStatusMsg('Đang kết nối MetaMask...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setStatusMsg('Vui lòng xác nhận giao dịch trên MetaMask...');
      
      const tx = await contract.createEvent(
        form.name,
        ethers.parseEther(form.price || '0'),
        Number(form.maxSupply || 0),
        Number(form.resaleRoyalty)
      );
      setStatusMsg('Đang chờ xác nhận từ blockchain...');
      const receipt = await tx.wait();

      let eventId: string | null = null;
      const iface = new ethers.Interface(CONTRACT_ABI);
      for (const log of receipt.logs) {
        try {
          const p = iface.parseLog({ topics: log.topics as string[], data: log.data });
          if (p?.name === 'EventCreated') {
            eventId = p.args.eventId.toString();
            break;
          }
        } catch {}
      }
      toast.success(`On-chain thành công! Event #${eventId || 'N/A'}`);

      if (eventId) {
        setStatusMsg('Đang lưu thông tin sự kiện vào Database...');
        const bodyData = {
          name: form.name,
          description: form.description,
          category: form.category,
          location: form.locationType === 'offline' ? form.venueName : 'Online',
          price: form.price,
          maxSupply: form.maxSupply,
          maxResellPercentage: form.resaleRoyalty,
          startTime: `${form.eventStartDate}T${form.eventStartTime}:00.000Z`,
          endTime: `${form.eventEndDate}T${form.eventEndTime}:00.000Z`,
          bannerUrl: uploadedBannerUrl
        };

        const tk = localStorage.getItem('token');
        const h: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        if (tk) h['Authorization'] = `Bearer ${tk}`;
        
        // SỬA Ở ĐÂY: Xóa /api để tránh lặp /api/api
        const res = await fetch(`${API_URL}/events/${eventId}`, { 
          method: 'PUT', 
          headers: h, 
          body: JSON.stringify(bodyData) 
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Không thể lưu dữ liệu lên database');
        }
      }
      toast.success('Tạo sự kiện và đồng bộ database thành công!');
      setTimeout(() => navigate('/organizer/events'), 1500);
    } catch (err: any) {
      toast.error(err?.reason || err?.message || 'Lỗi giao dịch');
      setStatusMsg('');
    } finally {
      setLoading(false);
    }
  };

  const sidebarW = isMobile ? 0 : sidebarExpanded ? 220 : 68;

  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes vtx-spin{to{transform:rotate(360deg)}}
      @keyframes vtx-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes vtx-pulse{0%,100%{opacity:1}50%{opacity:.4}}
      @keyframes vtx-tooltip-in{from{opacity:0;transform:translateY(-50%) translateX(-6px)}to{opacity:1;transform:translateY(-50%) translateX(0)}}
      .vtx-toggle-btn:hover{color:#38bdf8!important;background:rgba(56,189,248,.15)!important}
      input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;background:#3b82f6;border-radius:50%;border:2.5px solid #fff;box-shadow:0 0 10px rgba(59,130,246,.3);cursor:pointer;transition:transform .15s}
      input[type="range"]::-webkit-slider-thumb:hover{transform:scale(1.2)}
      input[type="range"]::-moz-range-thumb{width:18px;height:18px;background:#3b82f6;border-radius:50%;border:2.5px solid #fff;cursor:pointer}
      input[type=date]::-webkit-calendar-picker-indicator,input[type=time]::-webkit-calendar-picker-indicator{filter:invert(1) brightness(0.6)}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:99px}
      ::placeholder{color:#334155}
    `}</style>

      <ToastContainer position="top-right" autoClose={3500} theme="dark" />

      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.025) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="flex min-h-screen bg-[#070a11] text-slate-100 font-['Inter',sans-serif] relative z-[1]">
        <main
          className="flex-1 overflow-auto transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] min-w-0"
          style={{ marginLeft: sidebarW }}
        >
          <div className="max-w-[880px] mx-auto px-3.5 md:px-8 py-5 md:py-11 pb-16 md:pb-20">
            <StepIndicator
              currentStep={step}
              onStepClick={(s) => {
                if (step > s) setStep(s);
              }}
            />

            <div className="mb-5 md:mb-7 animate-[vtx-fade_0.4s_ease]">
              <h1 className="text-[22px] md:text-[28px] font-extrabold text-white tracking-tight">
                {STEPS[step - 1].label}
              </h1>
              <p className="text-[13px] text-slate-600 mt-1.5">
                {step === 1 && 'Nhập thông tin cơ bản về sự kiện của bạn'}
                {step === 2 && 'Cấu hình loại vé, giá, số lượng và thời gian bán'}
                {step === 3 && 'Nhập thông tin thanh toán, kiểm tra và phát hành lên blockchain'}
              </p>
            </div>

            {step === 1 && (
              <div className="mb-8 p-5 border border-dashed border-blue-500/40 bg-blue-900/10 rounded-2xl">
                <h3 className="text-[15px] text-blue-400 font-bold mb-3">Tải ảnh Banner lên Hệ thống (Bắt buộc)</h3>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-2">Hãy chọn ảnh ở form bên dưới, sau đó bấm nút tải lên.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUploadBanner}
                    disabled={isUploadingBanner || !bannerFile}
                    className="px-5 py-2.5 bg-[linear-gradient(135deg,#3b82f6_0%,#2563eb_100%)] rounded-xl text-white text-sm font-bold disabled:opacity-50 transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] cursor-pointer"
                  >
                    {isUploadingBanner ? 'Đang tải...' : 'Tải ảnh lên Cloudinary'}
                  </button>
                </div>
                {uploadedBannerUrl && (
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <span className="text-emerald-400 text-sm font-semibold">✓ Ảnh đã được lưu thành công trên hệ thống.</span>
                  </div>
                )}
              </div>
            )}

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
                loading={loading}
                statusMsg={statusMsg}
                onSubmit={handleSubmit}
              />
            )}

            <div
              className={`flex items-center mt-5 md:mt-7 gap-3 ${step === 1 ? 'justify-end' : 'justify-between'}`}
            >
              {step > 1 && (
                <button
                  type="button"
                  onClick={prev}
                  className="px-7 py-3 rounded-[10px] bg-transparent border border-white/10 text-slate-500 text-sm font-medium cursor-pointer transition-all duration-200 hover:border-blue-500 hover:text-slate-100"
                >
                  ← Quay lại
                </button>
              )}
              {step < 3 && (
                <button
                  type="button"
                  onClick={next}
                  className="px-8 py-3 rounded-[10px] bg-blue-500 border-none text-white text-sm font-semibold cursor-pointer transition-all duration-200 shadow-[0_4px_16px_rgba(59,130,246,0.25)] hover:bg-blue-600 hover:-translate-y-0.5"
                >
                  Tiếp tục →
                </button>
              )}
            </div>

            <p className="text-center text-[10px] tracking-[0.18em] uppercase text-slate-800 mt-10">
              Powered by Ethereum · ERC-721 NFT Standard
            </p>
          </div>
        </main>
      </div>
    </>
  );
}