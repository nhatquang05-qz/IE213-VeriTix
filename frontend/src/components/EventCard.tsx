import type { IEvent } from "../types/event.type";
import "../assets/styles/styles.css";

const EventCard = ({ event }: { event: IEvent }) => {
  const formattedTime = new Date(event.startDate).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="event-card">
      <img src={event.imageUrl} alt={event.title} />

      <div className="event-info">
        <h3>{event.title}</h3>
        <p>{event.location}</p>
        <p>{formattedTime}</p>

        <div className="event-footer">
          <span className="event-price">{event.price.toLocaleString()}đ</span>
          <div className="detail-button">Xem chi tiết</div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;