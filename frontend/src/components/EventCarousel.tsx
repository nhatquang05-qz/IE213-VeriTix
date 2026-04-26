import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockEvents } from '../data/mockEvents';

type FeaturedEvent = {
  id: string;
  badge?: string;
  gradient: string;
};

const featuredConfigs: FeaturedEvent[] = [
  {
    id: '1',
    badge: 'CONCERT',
    gradient: 'from-purple-600 to-pink-500',
  },
  {
    id: '2',
    badge: 'MUSIC',
    gradient: 'from-blue-600 to-cyan-400',
  },
  {
    id: '3',
    badge: 'LIVETOUR',
    gradient: 'from-red-600 to-orange-500',
  },
  {
    id: '4',
    badge: 'ESPORTS',
    gradient: 'from-emerald-600 to-teal-500',
  },
  {
    id: '5',
    badge: 'SPORT',
    gradient: 'from-amber-600 to-yellow-500',
  },
];

const featuredEvents = featuredConfigs
  .map((config) => {
    const event = mockEvents.find((item) => item._id === config.id);
    if (!event) return null;

    return {
      ...config,
      title: event.title,
      location: event.location,
      date: new Date(event.startDate).toLocaleDateString('vi-VN'),
      price: `${event.price.toLocaleString('vi-VN')}đ`,
    };
  })
  .filter((event): event is FeaturedEvent & {
    title: string;
    location: string;
    date: string;
    price: string;
  } => event !== null);

const EventCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  if (featuredEvents.length === 0) {
    return null;
  }

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredEvents.length - 1 : prev - 1
    );
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const currentEvent = featuredEvents[currentIndex];

  return (
    <section className="event-carousel-section">
      <div className="carousel-container">
        {/* Main Carousel */}
        <div className="carousel-main">
          <Link
            to={`/events/${currentEvent.id}`}
            className="carousel-slide"
          >
            <div className={`slide-background bg-gradient-to-r ${currentEvent.gradient}`}>
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <div className="slide-badge">{currentEvent.badge}</div>
                <h2 className="slide-title">{currentEvent.title}</h2>
                <div className="slide-info">
                  <p className="slide-location">
                    <span className="location-icon">📍</span> {currentEvent.location}
                  </p>
                  <p className="slide-date">
                    <span className="date-icon">📅</span> {currentEvent.date}
                  </p>
                </div>
                <div className="slide-price">
                  <span className="price-label">Giá từ</span>
                  <span className="price-value">{currentEvent.price}</span>
                </div>
                <div className="slide-cta">Khám Phá Ngay →</div>
              </div>
            </div>
          </Link>

          {/* Navigation Arrows */}
          <button
            className="carousel-nav carousel-nav-prev"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            className="carousel-nav carousel-nav-next"
            onClick={goToNext}
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        {/* Indicators */}
        <div className="carousel-indicators">
          {featuredEvents.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Thumbnails */}
        <div className="carousel-thumbnails">
          {featuredEvents.map((event, index) => (
            <button
              key={event.id}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              title={event.title}
            >
              <div className={`thumbnail-bg bg-gradient-to-r ${event.gradient}`}></div>
              <div className="thumbnail-info">
                <p className="thumbnail-title">{event.title}</p>
                <p className="thumbnail-price">{event.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCarousel;
