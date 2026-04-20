import type { IEvent } from "../types/event.type";

const EventCard = ({ event }: { event: IEvent }) => {
  return (
    <div className="overflow-hidden rounded-[18px] bg-[#0b1730] transition duration-300 hover:-translate-y-[5px] hover:shadow-[0_0_25px_rgba(76,201,240,0.4)] group-hover:-translate-y-1">
      <img src={event.imageUrl} alt={event.title} className="h-[180px] w-full object-cover" />

      <div className="p-4 text-[#edf6ff] leading-[1.65]">
        <h3>{event.title}</h3>
        <p>{event.location}</p>
        <p>{new Date(event.startDate).toLocaleDateString()}</p>

        <div className="mt-[10px] flex justify-between">
          <span className="font-bold">{event.price.toLocaleString()}đ</span>
          <div className="rounded-full bg-[#1d9bf0] px-[14px] py-2 text-[0.95rem] text-white transition-transform duration-200 ease-in-out group-hover:-translate-y-1">
            Xem chi tiết
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;