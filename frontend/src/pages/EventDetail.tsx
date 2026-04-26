import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { getEventById } from "../services/api";
import { buyTicket } from "../services/contract.service";
import { getEthToVndRate } from "../services/currency.service";
import { useWeb3 } from "../hooks/useWeb3";
import type { IEvent } from "../types/event.type";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [confirmations, setConfirmations] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'confirmed' | 'failed' | null>(null);
  const [ethRate, setEthRate] = useState<number>(80000000);
  const { account, connectWallet } = useWeb3();

  const handleBuyTicket = async () => {
    if (!account) {
      await connectWallet();
      return;
    }

    if (!event) return;

    // KIỂM TRA CHẶN LỖI ID = 0 HOẶC UNDEFINED
    if (!event.blockchainId || event.blockchainId === 0) {
      alert('Sự kiện này chưa được đồng bộ lên Blockchain. Vui lòng liên hệ ban tổ chức!');
      return;
    }

    if (remainingTickets <= 0) {
      alert('Vé đã hết!');
      return;
    }

    setLoading(true);
    setTransactionStatus('pending');
    setTransactionHash(null);
    setConfirmations(0);

    try {
      const eventId = event.blockchainId;
      const tokenURI = `https://veritix.com/ticket/${eventId}`;
      const priceInEth = (parseInt(event.price) / ethRate).toFixed(6).toString();

      const tx = await buyTicket(eventId, tokenURI, priceInEth);
      setTransactionHash(tx.hash);

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.waitForTransaction(tx.hash, 1);
      setConfirmations(1);
      setTransactionStatus('confirmed');

      alert('Mua vé thành công! Transaction hash: ' + tx.hash);
    } catch (error) {
      console.error('Error buying ticket:', error);
      setTransactionStatus('failed');
      alert('Lỗi khi mua vé: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    getEventById(id).then(setEvent);
    getEthToVndRate().then(setEthRate);
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-[55vh] px-6 py-20 text-center text-slate-200">
        <div className="mx-auto max-w-xl rounded-2xl border border-cyan-400/20 bg-slate-900/70 px-6 py-10 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur">
          Đang tải thông tin sự kiện...
        </div>
      </div>
    );
  }

  const remainingTickets = event.maxSupply - event.currentMinted;
  const soldPercent = event.maxSupply > 0 ? Math.min((event.currentMinted / event.maxSupply) * 100, 100) : 0;
  const eventDateLong = new Date(event.startTime).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const eventDateShort = new Date(event.startTime).toLocaleDateString("vi-VN");
  const estimatedEthPrice = (parseInt(event.price) / ethRate).toFixed(6);

  const txStatusLabel =
    transactionStatus === "pending"
      ? "Đang xử lý..."
      : transactionStatus === "confirmed"
        ? "Đã xác nhận"
        : "Thất bại";

  const txStatusClass =
    transactionStatus === "pending"
      ? "text-ed-warn"
      : transactionStatus === "confirmed"
        ? "text-ed-ok"
        : "text-ed-danger";

  return (
    <section
      className="relative isolate text-ed-text-main"
      style={{
        fontFamily: "'Space Grotesk', 'Segoe UI', Tahoma, sans-serif",
        background:
          "radial-gradient(circle at 15% 10%, rgba(46, 136, 255, 0.26), transparent 34%), radial-gradient(circle at 90% 20%, rgba(12, 197, 255, 0.25), transparent 28%), linear-gradient(160deg, #04070f 0%, #091127 42%, #0d1a33 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-15"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.25) 0.5px, transparent 0.5px)",
          backgroundSize: "3px 3px",
        }}
      />

      <header
        className="relative min-h-[500px] overflow-hidden border-b border-sky-300/20 bg-cover bg-center"
        style={{ backgroundImage: `url(${event.bannerUrl})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,23,0.68)_0%,rgba(2,8,23,0.32)_55%,rgba(2,8,23,0.64)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,9,19,0.2)_0%,rgba(4,9,19,0.72)_70%,rgba(4,9,19,0.94)_100%)]" />

        <div className="relative mx-auto flex min-h-[500px] w-full max-w-[1180px] flex-col justify-end px-7 pt-[88px] pb-[42px] md:min-h-[460px] md:px-[18px] md:pt-[78px] md:pb-7">
          <Link
            to="/"
            className="mb-[18px] inline-flex w-fit items-center gap-[10px] rounded-full border border-sky-300/35 bg-[rgba(3,12,27,0.62)] px-4 py-[9px] text-[#dff6ff] no-underline transition duration-200 hover:-translate-y-px hover:border-sky-300/65 hover:bg-[rgba(3,12,27,0.82)]"
          >
            <span className="text-lg leading-none">←</span>
            <span>Quay lại trang chủ</span>
          </Link>

          <div className="w-full max-w-[820px] animate-ed-float-in rounded-[28px] border border-ed-card-border bg-[linear-gradient(135deg,rgba(7,16,34,0.8)_0%,rgba(7,14,28,0.58)_100%)] p-[26px] shadow-ed-panel backdrop-blur-[14px] md:rounded-[22px] md:p-5">
            <span className="inline-flex items-center rounded-full border border-sky-400/45 bg-sky-500/12 px-[11px] py-[6px] text-[11px] font-bold uppercase tracking-[0.12em] text-[#b4eeff]">
              Sự kiện nổi bật
            </span>
            <h1 className="mt-3 mb-2 text-[clamp(2rem,5vw,3.8rem)] leading-[1.06] tracking-[-0.02em] max-[480px]:text-[1.8rem]">
              {event.name}
            </h1>
            <p className="m-0 text-[clamp(0.92rem,2vw,1.05rem)] text-ed-text-subtle">{event.location} • {eventDateLong}</p>
            <div className="mt-[18px] inline-flex w-fit items-center gap-[10px] rounded-2xl border border-sky-400/28 bg-[rgba(6,12,26,0.78)] px-[14px] py-[10px] font-semibold text-[#9adff7] max-[480px]:flex max-[480px]:w-full max-[480px]:justify-between">
              <span>Giá từ</span>
              <strong className="text-[1.36rem] tracking-[-0.02em] text-white">
                {parseInt(event.price).toLocaleString()}đ <span className="text-[1rem] text-[#bcefff] font-normal">(~{estimatedEthPrice} ETH)</span>
              </strong>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-[22px] px-7 pt-[34px] pb-[52px] max-[1100px]:grid-cols-1 md:gap-4 md:px-[18px] md:pt-[22px] md:pb-[34px]">
        <article className="rounded-[28px] border border-ed-card-border bg-[linear-gradient(150deg,rgba(8,14,28,0.76)_0%,rgba(8,16,32,0.68)_100%)] p-[30px] shadow-ed-card md:order-1 md:rounded-[22px] md:p-5">
          <h2>Giới thiệu sự kiện</h2>
          <p className="m-0 leading-[1.72] text-ed-text-subtle max-[480px]:leading-[1.65]">{event.description}</p>

          <div className="mt-6 rounded-[18px] border border-sky-300/22 bg-[rgba(3,11,24,0.65)] p-4">
            <div className="mb-2 flex items-center justify-between text-[0.92rem] text-ed-text-subtle">
              <span>Tiến độ bán vé</span>
              <strong className="text-base text-[#ccf2ff]">{soldPercent.toFixed(1)}%</strong>
            </div>
            <div className="h-[9px] overflow-hidden rounded-full bg-[rgba(22,36,58,0.88)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#2dd4ff_0%,#2f7bff_100%)] shadow-ed-progress transition-[width] duration-[420ms] ease-in-out"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-[18px] md:flex-col md:items-stretch">
            <div className="grid gap-2 text-[0.96rem] text-ed-text-subtle">
              <div>
                <span className="font-semibold text-[#8cceea]">Địa điểm:</span> {event.location}
              </div>
              <div>
                <span className="font-semibold text-[#8cceea]">Số vé còn:</span> {remainingTickets}
              </div>
            </div>

            <button
              className="min-w-[186px] cursor-pointer rounded-2xl border-0 bg-[linear-gradient(120deg,#0ea5e9_0%,#2563eb_62%,#1d4ed8_100%)] px-[22px] py-[13px] text-base font-bold text-white shadow-ed-btn transition duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-ed-btn-hover disabled:cursor-not-allowed disabled:opacity-55 md:w-full"
              onClick={handleBuyTicket}
              disabled={loading || remainingTickets <= 0 || !event.blockchainId}
            >
              {!event.blockchainId ? 'Sự kiện chưa mở' : remainingTickets <= 0 ? 'Hết vé' : loading ? 'Đang xử lý...' : 'Mua vé ngay'}
            </button>
          </div>

          {transactionStatus && (
            <div className="mt-6 rounded-[18px] border border-sky-300/22 bg-[rgba(3,11,24,0.65)] p-4">
              <h3 className="mt-0 mb-[10px] text-[1.02rem] text-[#bcefff]">Trạng thái giao dịch</h3>
              <div className="grid gap-2 text-[0.92rem] text-ed-text-subtle">
                <p>
                  <strong className="text-[#8cceea]">Trạng thái:</strong>{' '}
                  <span className={`font-bold ${txStatusClass}`}>
                    {txStatusLabel}
                  </span>
                </p>
                {transactionHash && (
                  <p>
                    <strong className="text-[#8cceea]">Transaction Hash:</strong>{' '}
                    <a
                      href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-b border-dashed border-b-[rgba(137,219,255,0.6)] text-[#89dbff] no-underline hover:border-b-[rgba(216,245,255,0.88)] hover:text-[#d8f5ff]"
                    >
                      {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                    </a>
                  </p>
                )}
                {confirmations > 0 && (
                  <p>
                    <strong className="text-[#8cceea]">Xác nhận:</strong> {confirmations} block(s)
                  </p>
                )}
              </div>
            </div>
          )}
        </article>

        <aside className="h-fit rounded-[28px] border border-ed-card-border bg-[linear-gradient(150deg,rgba(8,14,28,0.76)_0%,rgba(8,16,32,0.68)_100%)] p-[26px] shadow-ed-card max-[1100px]:order-2 md:rounded-[22px] md:p-5">
          <h3 className="mt-0 mb-3 text-[1.4rem] tracking-[-0.02em]">Thông tin chi tiết</h3>

          <div className="grid gap-[10px]">
            <div className="flex items-center justify-between gap-[10px] rounded-[14px] border border-slate-400/18 bg-white/3 p-[13px] text-[0.92rem] text-ed-text-soft md:flex-col md:items-start">
              <span>Ngày tổ chức</span>
              <strong className="text-right font-semibold text-[#eff8ff] md:text-left">{eventDateShort}</strong>
            </div>
            <div className="flex items-center justify-between gap-[10px] rounded-[14px] border border-slate-400/18 bg-white/3 p-[13px] text-[0.92rem] text-ed-text-soft md:flex-col md:items-start">
              <span>Giá vé</span>
              <strong className="text-right font-semibold text-[#eff8ff] md:text-left">{parseInt(event.price).toLocaleString()}đ</strong>
            </div>
            <div className="flex items-center justify-between gap-[10px] rounded-[14px] border border-slate-400/18 bg-white/3 p-[13px] text-[0.92rem] text-ed-text-soft md:flex-col md:items-start">
              <span>Số lượng</span>
              <strong className="text-right font-semibold text-[#eff8ff] md:text-left">{event.maxSupply.toLocaleString()}</strong>
            </div>
            <div className="flex items-center justify-between gap-[10px] rounded-[14px] border border-slate-400/18 bg-white/3 p-[13px] text-[0.92rem] text-ed-text-soft md:flex-col md:items-start">
              <span>Đã bán</span>
              <strong className="text-right font-semibold text-[#eff8ff] md:text-left">{event.currentMinted.toLocaleString()}</strong>
            </div>
            <div className="rounded-[14px] border border-slate-400/18 bg-white/3 p-[13px]">
              <div className="mb-2 text-[0.9rem] text-ed-text-soft">Ví nhà tổ chức</div>
              <p className="m-0 break-all font-mono text-[0.78rem] text-[#bcefff]">{event.organizerWallet}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventDetail;