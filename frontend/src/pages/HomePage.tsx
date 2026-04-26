import React, { useEffect, useState } from 'react';
import EventCarousel from '../components/EventCarousel';
import TicketListing from '../components/TicketListing';
import { eventService } from '../services/event.service';
import { type Event } from '../types/event.type';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Đang tải sự kiện...</div>; 
  }

  return (
    <div className="homepage">
      <EventCarousel events={events} />
      <TicketListing events={events} />
    </div>
  );
};

export default HomePage;