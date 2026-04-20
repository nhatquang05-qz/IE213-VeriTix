import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { getEventById } from "../services/api";
import { buyTicket } from "../services/contract.service";
import { useWeb3 } from "../hooks/useWeb3";
import type { IEvent } from "../types/event.type";
import Footer from "../components/Footer";

const EventDetail = () => {
  const { id } = useParams();

  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [confirmations, setConfirmations] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<
    "pending" | "confirmed" | "failed" | null
  >(null);

  const { account, connectWallet } = useWeb3();

  useEffect(() => {
    if (!id) return;
    getEventById(id).then(setEvent);
  }, [id]);

  const remainingTickets =
    event ? event.maxSupply - event.soldCount : 0;

  const statusText =
    transactionStatus === "pending"
      ? "Đang xử lý"
      : transactionStatus === "confirmed"
      ? "Đã xác nhận"
      : transactionStatus === "failed"
      ? "Thất bại"
      : "";

  const statusClass =
    transactionStatus === "pending"
      ? "text-amber-300"
      : transactionStatus === "confirmed"
      ? "text-emerald-300"
      : "text-rose-300";

  const handleBuyTicket = async () => {
    if (!account) {
      await connectWallet();
      return;
    }

    if (!event) return;

    if (remainingTickets <= 0) {
      alert("Vé đã hết!");
      return;
    }

    setLoading(true);
    setTransactionStatus("pending");
    setTransactionHash(null);
    setConfirmations(0);

    try {
      const eventId = event.onChainId;
      const tokenURI = `https://example.com/ticket/${eventId}`;
      const priceInEth = (event.price / 1000000).toString();

      const tx = await buyTicket(eventId, tokenURI, priceInEth);
      setTransactionHash(tx.hash);

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.waitForTransaction(tx.hash, 1);

      setConfirmations(1);
      setTransactionStatus("confirmed");

      alert("Mua vé thành công!");
    } catch (error) {
      console.error(error);
      setTransactionStatus("failed");
      alert("Lỗi khi mua vé!");
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="py-32 text-center text-slate-400">
        Đang tải thông tin sự kiện...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#020617] pb-16 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* MAIN CENTER */}
        <div>
          {/* HERO */}
          <div
            className="relative mt-4 h-[400px] overflow-hidden rounded-3xl shadow-xl"
            style={{
              backgroundImage: `url(${event.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90" />

            {/* BACK BUTTON - Positioned in hero top left */}
            <div className="absolute top-4 left-4 z-10">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 rounded px-2 py-1.5 text-sm text-slate-100 no-underline transition hover:text-cyan-300 focus:outline-none focus-visible:outline-none"
              >
                <span className="transition group-hover:-translate-x-1">←</span>
                <span>Quay lại</span>
              </Link>
            </div>

            <div className="relative flex h-full flex-col justify-end p-6 text-center lg:p-10 lg:text-left">
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {event.title}
              </h1>

              <p className="mt-3 text-slate-300">
                {event.location} • {new Date(event.startDate).toLocaleDateString("vi-VN")}
              </p>

              <div className="mt-5 text-3xl font-bold text-cyan-400">
                {event.price.toLocaleString()}đ
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-16 grid gap-12 lg:grid-cols-[2fr_1fr]">
            {/* LEFT */}
            <div className="space-y-6">
              {/* DESCRIPTION */}
              <div className="rounded-2xl border-2 border-cyan-500/20 bg-white/5 p-8 shadow-lg backdrop-blur-md transition hover:shadow-xl">
                <h2 className="mb-4 bg-gradient-to-r from-cyan-300 to-sky-300 bg-clip-text text-xl font-bold text-transparent">
                  Giới thiệu
                </h2>
                <p className="leading-8 text-slate-200">{event.description}</p>
              </div>

              {/* BUY BOX */}
              <div className="rounded-2xl border-2 border-cyan-400/35 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 p-8 shadow-lg transition hover:border-cyan-400/55 hover:shadow-xl">
                <div className="mb-6 flex items-center justify-between gap-8 border-b border-white/10 pb-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-400">Còn lại</p>
                    <p className="mt-1 text-2xl font-bold text-cyan-300">{remainingTickets}</p>
                  </div>

                  <div className="flex-1 text-right">
                    <p className="text-sm font-medium text-slate-400">Giá vé</p>
                    <p className="mt-1 bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-2xl font-bold text-transparent">
                      {event.price.toLocaleString()}đ
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBuyTicket}
                  disabled={loading || remainingTickets <= 0}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.01] hover:from-cyan-400 hover:to-sky-400 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {remainingTickets <= 0
                    ? "Hết vé"
                    : loading
                    ? "Đang xử lý..."
                    : "Mua vé ngay"}
                </button>
              </div>

              {/* TRANSACTION */}
              {transactionStatus && (
                <div className="rounded-2xl border-2 border-white/15 bg-black/40 p-8 shadow-md backdrop-blur-md">
                  <h3 className="mb-4 font-bold text-slate-100">Giao dịch</h3>

                  <p className="text-sm leading-6 text-slate-300">
                    Trạng thái:
                    <span className={`ml-2 font-semibold ${statusClass}`}>{statusText}</span>
                  </p>

                  {transactionHash && (
                    <p className="mt-2 text-sm leading-6">
                      Hash:{" "}
                      <a
                        href={`https://etherscan.io/tx/${transactionHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 underline"
                      >
                        {transactionHash.slice(0, 10)}...
                      </a>
                    </p>
                  )}

                  {confirmations > 0 && <p className="mt-1 text-sm">Xác nhận: {confirmations}</p>}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <aside className="space-y-4">
              <div className="rounded-2xl border-2 border-sky-500/20 bg-white/5 p-8 shadow-lg backdrop-blur-md transition hover:shadow-xl">
                <h3 className="mb-6 bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text font-bold text-transparent">
                  Thông tin
                </h3>

                <div className="space-y-4 text-sm leading-7">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-400">Ngày</span>
                    <span>{new Date(event.startDate).toLocaleDateString("vi-VN")}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-400">Tổng vé</span>
                    <span className="font-semibold text-cyan-300">{event.maxSupply}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-400">Đã bán</span>
                    <span className="font-semibold text-sky-300">{event.soldCount}</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <span className="font-medium text-slate-400">Organizer</span>
                    <span className="break-all text-right font-mono text-xs text-cyan-200/80">
                      {event.organizerWallet}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div>
          <Footer />
        </div>
      </div>
    </section>
  );
};

export default EventDetail;