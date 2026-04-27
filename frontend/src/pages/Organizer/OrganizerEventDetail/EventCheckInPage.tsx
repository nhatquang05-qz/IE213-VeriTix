import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import {
  MdCameraAlt,
  MdCheckCircleOutline,
  MdErrorOutline,
  MdLogout,
  MdPeopleOutline,
  MdQrCodeScanner,
  MdRefresh,
} from 'react-icons/md';
import api, { getErrorMessage } from '../../../services/api';
import type { CheckInPayload, CheckInResponse, EventDetailContext } from '../../../types/organizer.type';

const DonutRing: React.FC<{ percent: number; color: string; size?: number }> = ({
  percent,
  color,
  size = 110,
}) => {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="9"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-bold"
        fill={color}
      >
        {percent} %
      </text>
    </svg>
  );
};

type CheckInStatus = 'idle' | 'starting' | 'ready' | 'processing' | 'success' | 'error';

type CheckInFeedback = {
  status: CheckInStatus;
  title: string;
  message: string;
  detail?: string;
  ticketId?: number | string;
  scannedAt?: string;
};

const DEFAULT_FEEDBACK: CheckInFeedback = {
  status: 'idle',
  title: 'Sẵn sàng quét',
  message: 'Đưa mã QR của vé vào khung camera để check-in.',
};

function parseCheckInPayload(rawText: string): CheckInPayload | null {
  const trimmed = rawText.trim();

  try {
    const parsed = JSON.parse(trimmed) as Partial<CheckInPayload> & {
      ticketId?: number | string;
      id?: number | string;
    };

    const blockchainTicketId = Number(parsed.blockchainTicketId ?? parsed.ticketId ?? parsed.id);
    const timestamp = Number(parsed.timestamp);
    const signature = String(parsed.signature ?? '').trim();

    if (Number.isFinite(blockchainTicketId) && Number.isFinite(timestamp) && signature) {
      return { blockchainTicketId, timestamp, signature };
    }
  } catch {
    // Fall through
  }

  const candidate = trimmed.includes('?') ? trimmed.slice(trimmed.indexOf('?') + 1) : trimmed;
  const params = new URLSearchParams(candidate);

  const blockchainTicketId = Number(params.get('blockchainTicketId'));
  const timestamp = Number(params.get('timestamp'));
  const signature = params.get('signature')?.trim() ?? '';

  if (Number.isFinite(blockchainTicketId) && Number.isFinite(timestamp) && signature) {
    return { blockchainTicketId, timestamp, signature };
  }

  return null;
}

function formatTime(value?: string) {
  if (!value) return '--';
  return new Date(value).toLocaleString('vi-VN');
}

export default function EventCheckInPage() {
  const { event } = useOutletContext<EventDetailContext>();

  if (!event) return null;

  const scannerContainerId = `checkin-scanner-${event._id}`;
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanLockRef = useRef(false);
  const startingScannerRef = useRef(false);

  const totalSold = event.currentMinted;
  
  // Tạm thời khởi tạo bằng 0, sau này bạn có thể gọi thêm API getCheckInStats để cập nhật chính xác
  const summary = useMemo(
    () => ({
      checkedIn: 0,
      insideNow: 0,
      leftVenue: 0,
    }),
    [event._id]
  );
  
  const [summaryState, setSummaryState] = useState(summary);
  const [feedback, setFeedback] = useState<CheckInFeedback>(DEFAULT_FEEDBACK);
  const [isScannerReady, setIsScannerReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSummaryState(summary);
  }, [summary]);

  const { checkedIn, insideNow, leftVenue } = summaryState;
  const checkinPercent = totalSold > 0 ? Math.round((checkedIn / totalSold) * 100) : 0;

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      await scanner.stop();
    } catch {}

    try {
      await scanner.clear();
    } catch {}

    scannerRef.current = null;
    startingScannerRef.current = false;
    setIsScannerReady(false);
  };

  const handleScanPayload = async (rawText: string) => {
    if (scanLockRef.current) return;
    scanLockRef.current = true;
    setIsSubmitting(true);
    
    setFeedback({
      status: 'processing',
      title: 'Đang kiểm tra vé',
      message: 'Đang xác thực chữ ký số và trạng thái vé...',
      detail: rawText,
    });

    await stopScanner();

    const payload = parseCheckInPayload(rawText);
    if (!payload) {
      setFeedback({
        status: 'error',
        title: 'QR không hợp lệ',
        message: 'Mã QR không đúng định dạng của VeriTix.',
        scannedAt: new Date().toISOString(),
      });
      setIsSubmitting(false);
      scanLockRef.current = false;
      return;
    }

    try {
      // GỌI THẲNG API BACKEND
      const response = await api.post<CheckInResponse>('/tickets/checkin', payload);
      
      setSummaryState((current) => ({
        ...current,
        checkedIn: current.checkedIn + 1,
        insideNow: current.insideNow + 1,
      }));

      setFeedback({
        status: 'success',
        title: 'Check-in thành công',
        message: response.data?.message || 'Vé hợp lệ. Đã chuyển trạng thái sang Đã sử dụng.',
        ticketId: payload.blockchainTicketId,
        scannedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      setFeedback({
        status: 'error',
        title: 'Check-in thất bại',
        message: error.response?.data?.message || getErrorMessage(error),
        ticketId: payload.blockchainTicketId,
        scannedAt: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
      scanLockRef.current = false;
    }
  };

  const startScanner = async () => {
    if (startingScannerRef.current) return;

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!window.isSecureContext && !isLocalhost) {
      setFeedback({
        status: 'error',
        title: 'Không thể mở camera',
        message: 'Trình duyệt chỉ cho phép mở camera trên môi trường bảo mật (HTTPS hoặc localhost).',
      });
      return;
    }

    const scannerContainer = document.getElementById(scannerContainerId);
    if (!scannerContainer) return;

    if (scannerRef.current) await stopScanner();

    startingScannerRef.current = true;
    setFeedback({
      status: 'starting',
      title: 'Đang mở camera',
      message: 'Vui lòng cấp quyền sử dụng camera...',
    });

    const scanner = new Html5Qrcode(scannerContainerId);
    scannerRef.current = scanner;

    try {
      const scanConfig = { fps: 10, qrbox: { width: 260, height: 260 }, aspectRatio: 1 };
      const onScanSuccess = (decodedText: string) => { void handleScanPayload(decodedText); };

      const cameras = await Html5Qrcode.getCameras();
      if (cameras.length > 0) {
        const preferredCamera = cameras.find((cam) => /back|rear|environment|sau/i.test(cam.label)) ?? cameras[0];
        await scanner.start(preferredCamera.id, scanConfig, onScanSuccess, () => {});
      } else {
        await scanner.start({ facingMode: 'environment' }, scanConfig, onScanSuccess, () => {});
      }

      setIsScannerReady(true);
      startingScannerRef.current = false;
      setFeedback({
        status: 'ready',
        title: 'Camera đã sẵn sàng',
        message: 'Đưa mã QR của khách hàng vào khung vuông.',
      });
    } catch (error) {
      scannerRef.current = null;
      startingScannerRef.current = false;
      setIsScannerReady(false);
      setFeedback({
        status: 'error',
        title: 'Không thể mở camera',
        message: 'Vui lòng kiểm tra lại quyền truy cập camera của trình duyệt.',
      });
    }
  };

  useEffect(() => {
    void startScanner();
    return () => { void stopScanner(); };
  }, [event._id]);

  const tone =
    feedback.status === 'success'
      ? { shell: 'border-emerald-500/30 bg-emerald-500/[0.06]', header: 'bg-emerald-500/[0.12]', accent: 'text-emerald-400', ring: 'border-emerald-500/20' }
      : feedback.status === 'error'
        ? { shell: 'border-rose-500/30 bg-rose-500/[0.06]', header: 'bg-rose-500/[0.12]', accent: 'text-rose-400', ring: 'border-rose-500/20' }
        : feedback.status === 'processing'
          ? { shell: 'border-amber-500/30 bg-amber-500/[0.06]', header: 'bg-amber-500/[0.12]', accent: 'text-amber-400', ring: 'border-amber-500/20' }
          : { shell: 'border-cyan-500/20 bg-cyan-500/[0.04]', header: 'bg-cyan-500/[0.08]', accent: 'text-cyan-300', ring: 'border-cyan-500/20' };

  return (
    <div className="max-w-[1180px] mx-auto animate-[vtx-fade_0.35s_ease]">
      <h2 className="text-base sm:text-lg font-bold text-white mb-5">Check-in Xác thực QR</h2>

      {/* Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3 md:gap-4 mb-6">
        <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 sm:gap-6">
          <div className="min-w-0">
            <p className="text-[12px] sm:text-[13px] text-slate-500 mb-1">Đã check-in</p>
            <p className="text-xl sm:text-2xl font-bold text-white font-mono">
              {checkedIn.toLocaleString('vi-VN')}
              <span className="text-sm sm:text-base text-slate-600 font-normal ml-1">vé</span>
            </p>
            <p className="text-[11.5px] sm:text-[12px] text-slate-600 mt-1.5">
              Tổng phát hành: {totalSold.toLocaleString('vi-VN')} vé
            </p>
          </div>
          <DonutRing percent={checkinPercent} color="#eab308" size={100} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          <div className="bg-[#0d1117] border border-white/[0.06] rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/[0.1] flex items-center justify-center shrink-0 text-emerald-400"><MdPeopleOutline size={18} /></div>
              <span className="text-[12px] sm:text-[13px] text-slate-400 truncate">Trong sự kiện</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">{insideNow}</span>
          </div>

          <div className="bg-[#0d1117] border border-white/[0.06] rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-rose-500/[0.1] flex items-center justify-center shrink-0 text-rose-400"><MdLogout size={18} /></div>
              <span className="text-[12px] sm:text-[13px] text-slate-400 truncate">Đã ra ngoài</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-rose-400 font-mono">{leftVenue}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-4 mb-6">
        {/* Camera Section */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#0b1020] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <div className={`px-5 py-4 border-b border-white/[0.06] ${tone.header}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-11 h-11 rounded-2xl border ${tone.ring} flex items-center justify-center ${tone.header}`}>
                  <MdQrCodeScanner size={22} className={tone.accent} />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm sm:text-base">Màn hình Quét QR</p>
                  <p className="text-slate-400 text-[12px] sm:text-[13px]">Hệ thống sẽ cập nhật trạng thái ngay sau khi quét.</p>
                </div>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold ${tone.shell} ${tone.accent}`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {feedback.status === 'success' ? 'Đã xác nhận' : feedback.status === 'error' ? 'Lỗi xác thực' : feedback.status === 'processing' ? 'Đang xử lý' : isScannerReady ? 'Camera hoạt động' : 'Đang khởi động'}
              </div>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/[0.08] bg-black/20 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-2 text-slate-300 text-[13px] font-medium"><MdCameraAlt size={16} /> Camera trực tiếp</div>
                  <span className="text-[11px] text-slate-500">Đặt QR nằm gọn trong khung vuông</span>
                </div>
                <div className="relative aspect-[4/3] bg-[#050814]">
                  <div id={scannerContainerId} className="h-full w-full" />
                  {!isScannerReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#050814]/80 backdrop-blur-sm">
                      <div className="text-center px-6 max-w-sm">
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/[0.12] border border-cyan-500/20 flex items-center justify-center text-cyan-300 mb-4"><MdCameraAlt size={26} /></div>
                        <p className="text-white font-semibold mb-1">Đang chờ Camera</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => void startScanner()} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-cyan-400 disabled:opacity-60"><MdQrCodeScanner size={18} /> Quét lại</button>
                <button type="button" onClick={() => void stopScanner()} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] font-semibold text-slate-200 hover:bg-white/[0.06]"><MdRefresh size={18} /> Dừng camera</button>
              </div>
            </div>

            {/* Trạng thái quét */}
            <aside className={`rounded-3xl border ${tone.shell} p-5 flex flex-col gap-4`}>
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-2xl border ${tone.ring} flex items-center justify-center ${tone.header}`}>
                  {feedback.status === 'success' ? <MdCheckCircleOutline size={24} className={tone.accent} /> : feedback.status === 'error' ? <MdErrorOutline size={24} className={tone.accent} /> : <MdQrCodeScanner size={24} className={tone.accent} />}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${tone.accent}`}>{feedback.title}</p>
                  <p className="text-[13px] leading-6 text-slate-300 mt-1">{feedback.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">Lệnh Hệ Thống</p>
                  <p className="text-white font-semibold text-sm">
                    {feedback.status === 'success' ? 'Vé hợp lệ. VUI LÒNG CHO KHÁCH VÀO CỔNG.' : feedback.status === 'error' ? 'TỪ CHỐI CHECK-IN.' : 'Đang chờ xác thực...'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                    <p className="text-[11px] text-slate-500 mb-1">Mã Token Vé</p>
                    <p className="text-sm font-mono text-white">{feedback.ticketId ? `#${feedback.ticketId}` : '--'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                    <p className="text-[11px] text-slate-500 mb-1">Thời gian quét</p>
                    <p className="text-sm font-mono text-white">{formatTime(feedback.scannedAt)}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Bảng kết quả nhanh */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#0d1117] p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">Kết quả phản hồi</h3>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold ${tone.shell} ${tone.accent}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              {feedback.status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-3">
            <div className={`rounded-3xl border ${tone.shell} p-5`}>
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-2xl border ${tone.ring} flex items-center justify-center ${tone.header}`}>
                  {feedback.status === 'success' ? <MdCheckCircleOutline size={22} className={tone.accent} /> : feedback.status === 'error' ? <MdErrorOutline size={22} className={tone.accent} /> : <MdQrCodeScanner size={22} className={tone.accent} />}
                </div>
                <div className="min-w-0">
                  <p className={`text-base font-bold ${tone.accent}`}>{feedback.title}</p>
                  <p className="text-[13px] leading-6 text-slate-300 mt-1">{feedback.message}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={() => void startScanner()} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-950 hover:bg-slate-200"><MdQrCodeScanner size={18} /> Quét tiếp</button>
                <button type="button" onClick={() => setFeedback(DEFAULT_FEEDBACK)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[13px] font-semibold text-slate-200 hover:bg-white/[0.06]"><MdRefresh size={18} /> Reset màn hình</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}