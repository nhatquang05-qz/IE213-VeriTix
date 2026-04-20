import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";
import type { IEvent } from "../types/event.type";
import { getEvents } from "../services/api";

const EventGrid = () => {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  return (
    <div className="px-10 py-[60px] text-[#f2f9ff] leading-[1.65]">
      <h2>Sự kiện nổi bật</h2>

      <div className="grid grid-cols-3 gap-[25px]">
        {events.map((event) => (
          <Link key={event._id} to={`/events/${event._id}`} className="group text-inherit no-underline">
            <EventCard event={event} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventGrid;
