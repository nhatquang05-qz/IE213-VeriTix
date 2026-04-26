import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type FeaturedEvent = {
  id: string;
  title: string;
  location: string;
  date: string;
  price: string;
  badge?: string;
  gradient: string;
};

const featuredEvents: FeaturedEvent[] = [
  {
    id: '1',
    title: 'GAI HOME CONCERT',
    location: 'TP. Hồ Chí Minh',
    date: '16/05/2026',
    price: '1.000.000đ',
    badge: 'CONCERT',
    gradient: 'from-purple-600 to-pink-500',
  },
  {
    id: '2',
    title: 'Mr Siro - Fan Concert',
    location: 'TP. Hồ Chí Minh',
    date: '30/04/2026',
    price: '800.000đ',
    badge: 'MUSIC',
    gradient: 'from-blue-600 to-cyan-400',
  },
  {
    id: '3',
    title: 'BÙI CÔNG NAM "THE STORY" LIVETOUR',
    location: 'TP. Hồ Chí Minh',
    date: '20/06/2026',
    price: '900.000đ',
    badge: 'LIVETOUR',
    gradient: 'from-red-600 to-orange-500',
  },
  {
    id: '4',
    title: 'VCT Pacific Stage 1 Finals',
    location: 'TP. Hồ Chí Minh',
    date: '26/04/2026',
    price: '200.000đ',
    badge: 'ESPORTS',
    gradient: 'from-emerald-600 to-teal-500',
  },
  {
    id: '5',
    title: 'SÂN KHẤU THIÊN ĐĂNG',
    location: 'Hà Nội',
    date: '27/04/2026',
    price: '330.000đ',
    badge: 'THEATRE',
    gradient: 'from-amber-600 to-yellow-500',
  },
];

const EventCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

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
