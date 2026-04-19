import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { getEventById } from "../services/api";
import { buyTicket } from "../services/contract.service";
import { useWeb3 } from "../hooks/useWeb3";
import type { IEvent } from "../types/event.type";

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
    return <div className="py-30 px-10 text-white text-center">Đang tải thông tin sự kiện...</div>;
  }

  const remainingTickets = event.maxSupply - event.soldCount;

  return (
    <section className="text-white">
      <div className="min-h-[420px] bg-cover bg-center relative" style={{ backgroundImage: `url(${event.imageUrl})` }}>
        <div className="bg-black/55 min-h-[420px] flex flex-col justify-end p-10">
          <Link to="/" className="text-blue-200 no-underline mb-4.5 inline-block">
            ← Quay lại trang chủ
          </Link>
          <div className="event-detail-hero-content">
            <span className="text-sm text-blue-300">Sự kiện nổi bật</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl m-0 mb-3">{event.title}</h1>
            <p className="text-blue-100 my-2">
              {event.location} • {new Date(event.startDate).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
            </p>
            <div className="mt-4.5 text-2xl font-bold">{event.price.toLocaleString()}đ</div>
          </div>
        </div>
      </div>

      <div className="p-15 grid gap-8 grid-cols-2">
        <div className="bg-blue-950/90 rounded-3xl p-8">
          <h2 className="mb-4">Giới thiệu sự kiện</h2>
          <p>{event.description}</p>
          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-blue-100 my-2">Địa điểm: {event.location}</div>
              <div className="text-blue-100 my-2">Số vé còn: {remainingTickets}</div>
            </div>
            <button className="bg-blue-500 text-white border-none rounded-xl py-3.5 px-6 cursor-pointer text-base disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleBuyTicket} disabled={loading || remainingTickets <= 0}>
              {remainingTickets <= 0 ? 'Hết vé' : loading ? 'Đang xử lý...' : 'Mua vé ngay'}
            </button>
          </div>

          {transactionStatus && (
            <div className="mt-6">
              <h3 className="mb-4">Trạng thái giao dịch</h3>
              <div className="space-y-2">
                <p><strong>Trạng thái:</strong> 
                  {transactionStatus === 'pending' && 'Đang xử lý...'}
                  {transactionStatus === 'confirmed' && 'Đã xác nhận'}
                  {transactionStatus === 'failed' && 'Thất bại'}
                </p>
                {transactionHash && (
                  <p><strong>Transaction Hash:</strong> 
                    <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                      {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                    </a>
                  </p>
                )}
                {confirmations > 0 && (
                  <p><strong>Xác nhận:</strong> {confirmations} block(s)</p>
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="bg-blue-950/90 rounded-3xl p-8 grid gap-4.5">
          <h3 className="mb-4">Thông tin chi tiết</h3>
          <div className="flex justify-between p-3.5 rounded-xl bg-white/5">
            <span>Ngày tổ chức</span>
            <span>{new Date(event.startDate).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="flex justify-between p-3.5 rounded-xl bg-white/5">
            <span>Giá vé</span>
            <span>{event.price.toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between p-3.5 rounded-xl bg-white/5">
            <span>Số lượng</span>
            <span>{event.maxSupply.toLocaleString()}</span>
          </div>
          <div className="flex justify-between p-3.5 rounded-xl bg-white/5">
            <span>Đã bán</span>
            <span>{event.soldCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between p-3.5 rounded-xl bg-white/5">
            <span>Ví nhà tổ chức</span>
            <span>{event.organizerWallet}</span>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventDetail;
