import type { IEvent } from "../types/event.type";

const EventCard = ({ event }: { event: IEvent }) => {
  const formattedTime = new Date(event.startTime).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const priceFormatted = `${parseInt(event.price).toLocaleString('vi-VN')}đ`;

  return (
    <div className="event-card">
      <img src={event.bannerUrl || event.name} alt={event.name} />

      <div className="event-info">
        <h3>{event.name}</h3>
        <p>{event.location}</p>
        <p>{formattedTime}</p>
        <div className="event-footer">
          <span className="event-price">{priceFormatted}</span>
          <div className="detail-button">Xem chi tiết</div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;