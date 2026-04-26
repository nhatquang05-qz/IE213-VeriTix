import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { getEventById } from "../services/api";
import { buyTicket } from "../services/contract.service";
import { useWeb3 } from "../hooks/useWeb3";
import type { IEvent } from "../types/event.type";
import "../assets/styles/event-detail.css";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [confirmations, setConfirmations] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'confirmed' | 'failed' | null>(null);
  const { account, connectWallet } = useWeb3();

  const handleBuyTicket = async () => {
    if (!account) {
      await connectWallet();
      return;
    }

    if (!event) return;

    if (remainingTickets <= 0) {
      alert('Vé đã hết!');
      return;
    }

    setLoading(true);
    setTransactionStatus('pending');
    setTransactionHash(null);
    setConfirmations(0);

    try {
      // Sử dụng onChainId của event
      const eventId = event.onChainId;
      // tokenURI có thể là một string mặc định hoặc từ event
      const tokenURI = `https://example.com/ticket/${eventId}`;
      // Giá vé tính bằng ETH, giả sử 0.01 ETH cho mỗi vé
      const priceInEth = (event.price / 1000000).toString(); // Giả sử chuyển đổi từ VND sang ETH

      const tx = await buyTicket(eventId, tokenURI, priceInEth);
      setTransactionHash(tx.hash);

      // Theo dõi confirmations
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.waitForTransaction(tx.hash, 1); // Chờ 1 confirmation
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

  const remainingTickets = event.maxSupply - event.soldCount;
  const soldPercent = event.maxSupply > 0 ? Math.min((event.soldCount / event.maxSupply) * 100, 100) : 0;
  const eventDateLong = new Date(event.startDate).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const eventDateShort = new Date(event.startDate).toLocaleDateString("vi-VN");

  const txStatusLabel =
    transactionStatus === "pending"
      ? "Đang xử lý..."
      : transactionStatus === "confirmed"
        ? "Đã xác nhận"
        : "Thất bại";

  return (
    <section className="event-detail-page">
      <div className="event-detail-noise" />

      <header className="event-detail-hero" style={{ backgroundImage: `url(${event.imageUrl})` }}>
        <div className="event-detail-hero-overlay" />

        <div className="event-detail-hero-content-wrap">
          <Link to="/" className="event-detail-back-link">
            <span className="event-detail-back-arrow">←</span>
            <span>Quay lại trang chủ</span>
          </Link>

          <div className="event-detail-title-panel">
            <span className="event-detail-badge">Sự kiện nổi bật</span>
            <h1 className="event-detail-title">{event.title}</h1>
            <p className="event-detail-meta">{event.location} • {eventDateLong}</p>
            <div className="event-detail-price-pill">
              <span>Giá từ</span>
              <strong>{event.price.toLocaleString()}đ</strong>
            </div>
          </div>
        </div>
      </header>

      <div className="event-detail-main-grid">
        <article className="event-detail-main-card">
          <h2>Giới thiệu sự kiện</h2>
          <p>{event.description}</p>

          <div className="event-detail-progress-card">
            <div className="event-detail-progress-row">
              <span>Tiến độ bán vé</span>
              <strong>{soldPercent.toFixed(1)}%</strong>
            </div>
            <div className="event-detail-progress-track">
              <div
                className="event-detail-progress-fill"
                style={{ width: `${soldPercent}%` }}
              />
            </div>
          </div>

          <div className="event-detail-buy-row">
            <div className="event-detail-buy-meta">
              <div>
                <span>Địa điểm:</span> {event.location}
              </div>
              <div>
                <span>Số vé còn:</span> {remainingTickets}
              </div>
            </div>

            <button
              className="event-detail-buy-btn"
              onClick={handleBuyTicket}
              disabled={loading || remainingTickets <= 0}
            >
              {remainingTickets <= 0 ? 'Hết vé' : loading ? 'Đang xử lý...' : 'Mua vé ngay'}
            </button>
          </div>

          {transactionStatus && (
            <div className="event-detail-tx-card">
              <h3>Trạng thái giao dịch</h3>
              <div className="event-detail-tx-content">
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  <span className={`event-detail-tx-status event-detail-tx-status--${transactionStatus}`}>
                    {txStatusLabel}
                  </span>
                </p>
                {transactionHash && (
                  <p>
                    <strong>Transaction Hash:</strong>{' '}
                    <a
                      href={`https://etherscan.io/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-detail-tx-link"
                    >
                      {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                    </a>
                  </p>
                )}
                {confirmations > 0 && (
                  <p>
                    <strong>Xác nhận:</strong> {confirmations} block(s)
                  </p>
                )}
              </div>
            </div>
          )}
        </article>

        <aside className="event-detail-side-card">
          <h3>Thông tin chi tiết</h3>

          <div className="event-detail-info-list">
            <div className="event-detail-info-item">
              <span>Ngày tổ chức</span>
              <strong>{eventDateShort}</strong>
            </div>
            <div className="event-detail-info-item">
              <span>Giá vé</span>
              <strong>{event.price.toLocaleString()}đ</strong>
            </div>
            <div className="event-detail-info-item">
              <span>Số lượng</span>
              <strong>{event.maxSupply.toLocaleString()}</strong>
            </div>
            <div className="event-detail-info-item">
              <span>Đã bán</span>
              <strong>{event.soldCount.toLocaleString()}</strong>
            </div>
            <div className="event-detail-info-wallet">
              <div>Ví nhà tổ chức</div>
              <p>{event.organizerWallet}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventDetail;
