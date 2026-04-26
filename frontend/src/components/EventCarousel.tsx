import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/api';
import type { IEvent } from '../types/event.type';

type FeaturedEvent = IEvent & {
  badge?: string;
  gradient: string;
  dateFormatted: string;
  priceFormatted: string;
};

const featuredConfigs = [
  { badge: 'CONCERT', gradient: 'from-purple-600 to-pink-500' },
  { badge: 'MUSIC', gradient: 'from-blue-600 to-cyan-400' },
  { badge: 'LIVETOUR', gradient: 'from-red-600 to-orange-500' },
  { badge: 'ESPORTS', gradient: 'from-emerald-600 to-teal-500' },
  { badge: 'SPORT', gradient: 'from-amber-600 to-yellow-500' },
];

const EventCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const events = await getEvents();
        
        // Filter active events and map to featured format
        const featured = events
          .filter(event => event.status === 'ACTIVE')
          .slice(0, 5)
          .map((event, index) => {
            const config = featuredConfigs[index] || { badge: 'EVENT', gradient: 'from-gray-600 to-gray-400' };
            const startDate = new Date(event.startTime);
            
            return {
              ...event,
              badge: config.badge,
              gradient: config.gradient,
              dateFormatted: startDate.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }),
              priceFormatted: `${parseInt(event.price).toLocaleString('vi-VN')}đ`,
            };
          });

        setFeaturedEvents(featured);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Không thể tải sự kiện');
        setFeaturedEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || featuredEvents.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, featuredEvents.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToPrevious = () => {
    if (featuredEvents.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? featuredEvents.length - 1 : prev - 1
    );
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToNext = () => {
    if (featuredEvents.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="relative bg-[linear-gradient(135deg,rgba(0,102,255,0.05)_0%,transparent_100%)] px-0 pt-20 pb-[100px]">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="relative mb-10 h-[500px] overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,102,255,0.3)] bg-gray-800 flex items-center justify-center">
            <div className="text-white text-lg">Đang tải sự kiện...</div>
          </div>
        </div>
      </section>
    );
  }

  // Error or no events state
  if (error || featuredEvents.length === 0) {
    return null;
  }

  const currentEvent = featuredEvents[currentIndex];

  return (
    <section className="relative bg-[linear-gradient(135deg,rgba(0,102,255,0.05)_0%,transparent_100%)] px-0 pt-20 pb-[100px]">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Main Carousel */}
        <div className="relative mb-10 h-[500px] overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,102,255,0.3)] max-[1024px]:h-[400px] max-[768px]:h-[320px] max-[480px]:h-[240px]">
          <Link
            to={`/events/${currentEvent._id}`}
            className="block h-full w-full no-underline text-inherit"
          >
            <div
              className="relative flex h-full w-full items-center justify-center overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(17, 24, 39, 0.32) 0%, rgba(3, 7, 18, 0.58) 100%), url(${currentEvent.bannerUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#1a1a2e',
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,22,40,0.6)_0%,rgba(0,0,0,0.3)_100%)]" />
              <div className="relative z-[2] max-w-[600px] px-10 text-center max-[768px]:px-6 max-[480px]:px-4">
                <div className="mb-5 inline-block rounded-[20px] border border-cyan-400/30 bg-white/20 px-4 py-2 text-xs font-bold tracking-[2px] text-cyan-300 backdrop-blur">{currentEvent.badge}</div>
                <h2 className="mb-6 text-5xl leading-[1.2] font-extrabold text-white [text-shadow:0_4px_20px_rgba(0,0,0,0.5)] max-[1024px]:text-4xl max-[768px]:text-[28px] max-[480px]:text-xl">{currentEvent.name}</h2>
                <div className="mb-7 flex flex-col gap-3 text-white/90 max-[768px]:mb-5 max-[768px]:gap-2">
                  <p className="flex items-center justify-center gap-2 text-base max-[768px]:text-sm max-[480px]:text-xs">
                    📍 {currentEvent.location}
                  </p>
                  <p className="flex items-center justify-center gap-2 text-base max-[768px]:text-sm max-[480px]:text-xs">
                    📅 {currentEvent.dateFormatted}
                  </p>
                </div>
                <div className="mb-7 flex flex-col items-center gap-2 max-[768px]:mb-5">
                  <span className="text-sm text-white/80">Giá từ</span>
                  <span className="bg-[linear-gradient(135deg,#00d4ff,#0066ff)] bg-clip-text text-[32px] font-extrabold text-transparent max-[768px]:text-2xl max-[480px]:text-xl">{currentEvent.priceFormatted}</span>
                </div>
                <div className="inline-block rounded-xl bg-[linear-gradient(135deg,#0066ff,#00d4ff)] px-8 py-3.5 text-base font-bold text-white shadow-[0_8px_24px_rgba(0,102,255,0.4)] max-[768px]:px-6 max-[768px]:py-3 max-[768px]:text-sm max-[480px]:px-5 max-[480px]:py-2.5 max-[480px]:text-[13px]">Khám Phá Ngay →</div>
              </div>
            </div>
          </Link>

          {/* Navigation Arrows */}
          <button
            className="absolute top-1/2 left-5 z-10 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/30 bg-white/10 text-2xl text-cyan-300 backdrop-blur transition hover:bg-cyan-400/20 max-[1024px]:left-3 max-[1024px]:h-10 max-[1024px]:w-10 max-[1024px]:text-lg max-[768px]:h-9 max-[768px]:w-9 max-[768px]:text-base max-[480px]:h-8 max-[480px]:w-8 max-[480px]:text-sm"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            className="absolute top-1/2 right-5 z-10 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/30 bg-white/10 text-2xl text-cyan-300 backdrop-blur transition hover:bg-cyan-400/20 max-[1024px]:right-3 max-[1024px]:h-10 max-[1024px]:w-10 max-[1024px]:text-lg max-[768px]:h-9 max-[768px]:w-9 max-[768px]:text-base max-[480px]:h-8 max-[480px]:w-8 max-[480px]:text-sm"
            onClick={goToNext}
            aria-label="Next slide"
          >
            →
          </button>
        </div>

        {/* Indicators */}
        <div className="mb-8 flex justify-center gap-3">
          {featuredEvents.map((_, index) => (
            <button
              key={index}
              className={`h-3 cursor-pointer rounded-full border-2 border-cyan-400/30 transition ${
                index === currentIndex
                  ? 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(0,212,255,0.6)]'
                  : 'w-3 bg-cyan-400/20'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1">
          {featuredEvents.map((event, index) => (
            <button
              key={event._id}
              className={`relative flex h-[120px] cursor-pointer overflow-hidden rounded-xl border-2 bg-transparent p-0 text-left transition ${
                index === currentIndex
                  ? 'border-cyan-400 shadow-[0_0_24px_rgba(0,212,255,0.5)]'
                  : 'border-cyan-400/20 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_8px_24px_rgba(0,212,255,0.3)]'
              }`}
              onClick={() => goToSlide(index)}
              title={event.name}
            >
              <div
                className="absolute z-[1] h-full w-full"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(17, 24, 39, 0.28) 0%, rgba(3, 7, 18, 0.52) 100%), url(${event.bannerUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#1a1a2e',
                }}
              />
              <div className="relative z-[2] flex h-full w-full flex-col justify-between bg-[linear-gradient(135deg,rgba(10,22,40,0.7)_0%,rgba(0,0,0,0.5)_100%)] p-3">
                <p className="line-clamp-2 text-[13px] leading-[1.2] font-semibold text-white">{event.name}</p>
                <p className="text-xs font-bold text-cyan-300">{event.priceFormatted}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCarousel;
