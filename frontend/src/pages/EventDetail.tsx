import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById } from "../services/api";
import type { IEvent } from "../types/event.type";
import "../assets/styles/event.css";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<IEvent | null>(null);

  useEffect(() => {
    if (!id) return;
    getEventById(id).then(setEvent);
  }, [id]);

  if (!event) {
    return <div className="event-detail-loading">Đang tải thông tin sự kiện...</div>;
  }

  const remainingTickets = event.maxSupply - event.soldCount;

  return (
    <section className="event-detail-page">
      <div className="event-detail-hero" style={{ backgroundImage: `url(${event.imageUrl})` }}>
        <div className="event-detail-hero-overlay">
          <Link to="/" className="back-link">
            ← Quay lại trang chủ
          </Link>
          <div className="event-detail-hero-content">
            <span className="event-category">Sự kiện nổi bật</span>
            <h1>{event.title}</h1>
            <p className="event-detail-meta">
              {event.location} • {new Date(event.startDate).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
            </p>
            <div className="event-detail-price">{event.price.toLocaleString()}đ</div>
          </div>
        </div>
      </div>

      <div className="event-detail-body">
        <div className="event-detail-description">
          <h2>Giới thiệu sự kiện</h2>
          <p>{event.description}</p>
          <div className="buy-section">
            <div>
              <div className="event-detail-location">Địa điểm: {event.location}</div>
              <div className="event-detail-capacity">Số vé còn: {remainingTickets}</div>
            </div>
            <button className="buy-button">Mua vé ngay</button>
          </div>
        </div>

        <aside className="event-detail-summary">
          <h3>Thông tin chi tiết</h3>
          <div className="event-detail-summary-item">
            <span>Ngày tổ chức</span>
            <span>{new Date(event.startDate).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="event-detail-summary-item">
            <span>Giá vé</span>
            <span>{event.price.toLocaleString()}đ</span>
          </div>
          <div className="event-detail-summary-item">
            <span>Số lượng</span>
            <span>{event.maxSupply.toLocaleString()}</span>
          </div>
          <div className="event-detail-summary-item">
            <span>Đã bán</span>
            <span>{event.soldCount.toLocaleString()}</span>
          </div>
          <div className="event-detail-summary-item">
            <span>Ví nhà tổ chức</span>
            <span>{event.organizerWallet}</span>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventDetail;
