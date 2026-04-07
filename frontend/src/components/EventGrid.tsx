import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";
import type { IEvent } from "../types/event.type";
import { getEvents } from "../services/api";
import "../assets/styles/event.css";

const EventGrid = () => {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  return (
    <div className="event-section">
      <h2>Sự kiện nổi bật</h2>

      <div className="event-grid">
        {events.map((event) => (
          <Link key={event._id} to={`/events/${event._id}`} className="event-card-link">
            <EventCard event={event} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventGrid;
