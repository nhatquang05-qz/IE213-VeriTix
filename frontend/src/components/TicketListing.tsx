import { Link } from 'react-router-dom';
import { mockEvents } from '../data/mockEvents';

type TicketItem = {
  id: string;
  title: string;
  info: string;
  time: string;
  price: string;
  href?: string;
  external?: boolean;
};

type TicketCategory = {
  name: string;
  items: TicketItem[];
};

const toTicketItem = (event: (typeof mockEvents)[number]): TicketItem => ({
  id: event._id,
  title: event.title,
  info: `${event.location} • ${new Date(event.startDate).toLocaleDateString('vi-VN')}`,
  time: `Thời gian: ${new Date(event.startDate).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })}`,
  price: `${event.price.toLocaleString('vi-VN')}đ`,
});

const categories: TicketCategory[] = [
  {
    name: 'Âm Nhạc & Concert Nổi Bật',
    items: mockEvents.filter((event) => [1, 2, 3, 10, 11, 12].includes(event.onChainId)).map(toTicketItem),
  },
  {
    name: 'Thể Thao & Trải Nghiệm',
    items: mockEvents.filter((event) => [4, 5, 6, 14, 18].includes(event.onChainId)).map(toTicketItem),
  },
  {
    name: 'Sân Khấu & Nghệ Thuật',
    items: mockEvents.filter((event) => [7, 8, 9, 15, 16].includes(event.onChainId)).map(toTicketItem),
  },
  {
    name: 'Hội Thảo & Workshop',
    items: mockEvents.filter((event) => [13, 17].includes(event.onChainId)).map(toTicketItem),
  },
];

const TicketListing = () => {
  return (
    <section className="ticket-listing">
      <div className="container">
        {categories.map((category) => (
          <div key={category.name} className="category-section">
            <div className="category-header">
              <h2 className="category-title">{category.name}</h2>
              <a href="#" className="view-more-btn">
                Xem Thêm →
              </a>
            </div>
            <div className="ticket-grid">
              {category.items.map((item) => (
                item.external ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ticket-card-link"
                  >
                    <div className="ticket-card">
                      <div className="ticket-card-image"></div>
                      <div className="ticket-card-body">
                        <h3 className="ticket-card-title">{item.title}</h3>
                        <p className="ticket-card-info">
                          <span className="info-icon">📍</span> {item.info}
                        </p>
                        <p className="ticket-card-info">
                          <span className="info-icon">🕒</span> {item.time}
                        </p>
                        <div className="ticket-card-price">
                          <span className="price-label">Từ</span>
                          <span className="price-value">{item.price}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link key={item.id} to={`/events/${item.id}`} className="ticket-card-link">
                    <div className="ticket-card">
                      <div className="ticket-card-image"></div>
                      <div className="ticket-card-body">
                        <h3 className="ticket-card-title">{item.title}</h3>
                        <p className="ticket-card-info">
                          <span className="info-icon">📍</span> {item.info}
                        </p>
                        <p className="ticket-card-info">
                          <span className="info-icon">🕒</span> {item.time}
                        </p>
                        <div className="ticket-card-price">
                          <span className="price-label">Từ</span>
                          <span className="price-value">{item.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TicketListing;
