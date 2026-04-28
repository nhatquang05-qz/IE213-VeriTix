import React, { useEffect, useRef, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import {
  MdCameraAlt,
  MdCheckCircleOutline,
  MdErrorOutline,
  MdQrCodeScanner,
  MdRefresh,
  MdFileUpload,
} from 'react-icons/md';
import api, { getErrorMessage } from '../../../services/api';
import type { CheckInPayload, CheckInResponse, EventDetailContext } from '../../../types/organizer.type';
import { toast } from 'react-toastify';

const DonutRing: React.FC<{ percent: number; color: string; size?: number }> = ({ percent, color, size = 110 }) => {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="9" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-sm font-bold" fill={color}>{percent} %</text>
    </svg>
  );
};

type CheckInStatus = 'idle' | 'starting' | 'ready' | 'processing' | 'success' | 'error';
type CheckInFeedback = { status: CheckInStatus; title: string; message: string; detail?: string; ticketId?: number | string; scannedAt?: string; };

const DEFAULT_FEEDBACK: CheckInFeedback = {
  status: 'idle',
  title: 'Sẵn sàng quét',
  message: 'Đưa mã QR vào camera hoặc tải ảnh lên để kiểm tra.',
};

function parseCheckInPayload(rawText: string): CheckInPayload | null {
  try {
    const parsed = JSON.parse(rawText.trim());
    const blockchainTicketId = Number(parsed.blockchainTicketId ?? parsed.ticketId ?? parsed.id);
    const timestamp = Number(parsed.timestamp);
    const signature = String(parsed.signature ?? '').trim();
    if (Number.isFinite(blockchainTicketId) && Number.isFinite(timestamp) && signature) {
      return { blockchainTicketId, timestamp, signature };
    }
  } catch {}
  return null;
}

export default function EventCheckInPage() {
  const { event } = useOutletContext<EventDetailContext>();
  const navigate = useNavigate();

  const scannerContainerId = `checkin-scanner-${event?._id}`;
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanLockRef = useRef(false);
  const startingScannerRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSold = event?.currentMinted || 0;
  
  const [summaryState, setSummaryState] = useState({ checkedIn: 0, insideNow: 0, leftVenue: 0 });
  const [feedback, setFeedback] = useState<CheckInFeedback>(DEFAULT_FEEDBACK);
  const [isScannerReady, setIsScannerReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    const fetchCheckinStats = async () => {
      if (!event?._id) return;
      try {
        const { data } = await api.get(`/events/${event._id}/checkin-stats`);
        setSummaryState({
          checkedIn: data.checkedIn,
          insideNow: data.insideNow,
          leftVenue: data.leftVenue
        });
      } catch (error) {
        console.error("Lỗi lấy dữ liệu thống kê:", error);
      }
    };
    
    fetchCheckinStats();
  }, [event?._id]);

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Lỗi khi dừng camera:", err);
      }
    }
    setIsScannerReady(false);
  };

  const processPayload = async (rawText: string) => {
    if (scanLockRef.current) return;
    scanLockRef.current = true;
    setIsSubmitting(true);
    
    setFeedback({ status: 'processing', title: 'Đang kiểm tra', message: 'Vui lòng chờ giây lát...' });

    const payload = parseCheckInPayload(rawText);
    if (!payload) {
      setFeedback({ status: 'error', title: 'QR không hợp lệ', message: 'Mã không đúng định dạng VeriTix.', scannedAt: new Date().toISOString() });
      setIsSubmitting(false);
      scanLockRef.current = false;
      return;
    }

    try {
      const response = await api.post<CheckInResponse>('/tickets/checkin', payload);
      
      setSummaryState(prev => ({ ...prev, checkedIn: prev.checkedIn + 1, insideNow: prev.insideNow + 1 }));
      setFeedback({ status: 'success', title: 'Thành công', message: response.data?.message || 'Vé hợp lệ.', ticketId: payload.blockchainTicketId, scannedAt: new Date().toISOString() });
    } catch (error: any) {
      const msg = error.response?.data?.message || getErrorMessage(error);
      
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        navigate('/login');
        return;
      }
      
      setFeedback({ status: 'error', title: 'Thất bại', message: msg, ticketId: payload.blockchainTicketId, scannedAt: new Date().toISOString() });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => { scanLockRef.current = false; }, 2500); 
    }
  };

  const handleFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }
      
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
        setIsScannerReady(false);
      }

      const decodedText = await scannerRef.current.scanFile(file, true);
      void processPayload(decodedText);
    } catch (err) {
      toast.error("Không tìm thấy mã QR trong ảnh này!");
      setFeedback({ status: 'error', title: 'Lỗi đọc ảnh', message: 'Vui lòng chọn ảnh rõ nét hơn.', scannedAt: new Date().toISOString() });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  const startScanner = async () => {
    if (startingScannerRef.current) return;
    startingScannerRef.current = true;

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }
      
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }

      await scannerRef.current.start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 }, (decodedText) => {
         void processPayload(decodedText);
      }, () => {});
      
      setIsScannerReady(true);
      setFeedback(DEFAULT_FEEDBACK);
    } catch (err) {
      console.warn("Không mở được camera:", err);
      setIsScannerReady(false);
    } finally {
      startingScannerRef.current = false;
    }
  };

  useEffect(() => {
    startScanner();
    return () => { void stopScanner(); };
  }, [event?._id]);

  if (!event) return null;

  const tone = feedback.status === 'success' ? { accent: 'text-emerald-400', shell: 'bg-emerald-500/10 border-emerald-500/20' } : feedback.status === 'error' ? { accent: 'text-rose-400', shell: 'bg-rose-500/10 border-rose-500/20' } : { accent: 'text-cyan-400', shell: 'bg-cyan-500/10 border-cyan-500/20' };
  const checkinPercent = totalSold > 0 ? Math.round((summaryState.checkedIn / totalSold) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        
        {}
        <div className="bg-[#0d1117] rounded-3xl border border-white/10 p-6 overflow-hidden flex flex-col justify-between">
          <div className="mb-4">
             <div className="flex items-center gap-2 text-white font-bold mb-3">
               <MdCameraAlt size={20} /> Màn hình Quét
             </div>
             <div id={scannerContainerId} className="w-full aspect-[4/3] bg-[#050814] rounded-2xl overflow-hidden relative shadow-inner">
               {!isScannerReady && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
                   <p className="text-slate-400 text-sm">Camera đang dừng</p>
                 </div>
               )}
             </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-auto">
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isSubmitting}
              className="flex-1 min-w-[140px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MdFileUpload size={20} /> TẢI ẢNH QR
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileScan} />
            
            <button 
              type="button" 
              onClick={isScannerReady ? stopScanner : startScanner} 
              disabled={isSubmitting}
              className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isScannerReady ? <><MdRefresh size={20} /> Dừng</> : <><MdCameraAlt size={20} /> Bật Cam</>}
            </button>
          </div>
        </div>

        {}
        <div className="flex flex-col gap-4">
           {}
           <div className="bg-[#0d1117] border border-white/10 rounded-3xl p-5 flex items-center justify-between">
              <div>
                <p className="text-[13px] text-slate-500 mb-1">Đã check-in</p>
                <p className="text-2xl font-bold text-white font-mono">{summaryState.checkedIn}</p>
                <p className="text-xs text-slate-600 mt-1">/ {totalSold} vé</p>
              </div>
              <DonutRing percent={checkinPercent} color="#0ea5e9" size={80} />
           </div>

           {}
           <div className={`flex-1 rounded-3xl border ${tone.shell} p-6 flex flex-col items-center justify-center text-center shadow-lg transition-colors`}>
             <div className={`text-5xl mb-4 flex justify-center ${tone.accent}`}>
               {feedback.status === 'success' ? <MdCheckCircleOutline /> : feedback.status === 'error' ? <MdErrorOutline /> : <MdQrCodeScanner />}
             </div>
             <h3 className={`text-xl font-bold mb-2 ${tone.accent}`}>{feedback.title}</h3>
             <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-[200px]">{feedback.message}</p>
             {feedback.ticketId && <div className="w-full bg-black/40 py-2 px-3 rounded-lg font-mono text-[13px] text-white truncate shadow-inner">ID: #{feedback.ticketId}</div>}
           </div> 
        </div>

      </div>
    </div>
  );
}