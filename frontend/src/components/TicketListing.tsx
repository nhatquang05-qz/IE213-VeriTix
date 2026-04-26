import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/api';
import type { IEvent } from '../types/event.type';

type TicketItem = {
  id: string;
  name: string;
  info: string;
  price: string;
  bannerUrl: string;
};

type TicketCategory = {
  name: string;
  items: TicketItem[];
};

const toTicketItem = (event: IEvent): TicketItem => ({
  id: event._id,
  name: event.name,
  info: `${event.location} • ${new Date(event.startTime).toLocaleDateString('vi-VN')}`,
  price: `${parseInt(event.price).toLocaleString('vi-VN')}đ`,
  bannerUrl: event.bannerUrl,
});

const TicketListing = () => {
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const events = await getEvents();
        
        // Filter active events and group by category
        const activeEvents = events.filter(event => event.status === 'ACTIVE');
        
        // Create categories based on available events
        const categorized: TicketCategory[] = [
          {
            name: 'Âm Nhạc & Concert Nổi Bật',
            items: activeEvents.slice(0, 4).map(toTicketItem),
          },
          {
            name: 'Thể Thao & Trải Nghiệm',
            items: activeEvents.slice(4, 8).map(toTicketItem),
          },
          {
            name: 'Sân Khấu & Nghệ Thuật',
            items: activeEvents.slice(8, 12).map(toTicketItem),
          },
          {
            name: 'Hội Thảo & Workshop',
            items: activeEvents.slice(12, 16).map(toTicketItem),
          },
        ].filter(cat => cat.items.length > 0);

        setCategories(categorized);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <section className="py-[100px]">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="text-center text-white">Đang tải vé...</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-[1400px] px-6">
        {categories.map((category) => (
          <div key={category.name} className="mb-20 last:mb-0">
            <div className="mb-8 flex items-center justify-between max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-4">
              <h2 className="text-[32px] font-bold text-white max-[768px]:text-2xl">{category.name}</h2>
              <a href="#" className="rounded-xl border-2 border-cyan-400/30 px-6 py-3 text-base font-semibold text-cyan-300 transition hover:translate-x-1 hover:border-cyan-400 hover:bg-cyan-400/10">
                Xem Thêm →
              </a>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {category.items.map((item) => (
                <Link key={item.id} to={`/events/${item.id}`} className="block text-inherit no-underline">
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(30,58,138,0.5)_0%,rgba(0,102,255,0.25)_100%)] transition hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-[0_12px_40px_rgba(0,102,255,0.3)]">
                    <div
                      className="relative h-40 w-full overflow-hidden"
                      style={{
                        backgroundImage: `linear-gradient(135deg, rgba(17, 24, 39, 0.25) 0%, rgba(3, 7, 18, 0.4) 100%), url(${item.bannerUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: '#1a1a2e',
                      }}
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="mb-3 line-clamp-2 text-base leading-[1.3] font-semibold text-white">{item.name}</h3>
                      <p className="mb-4 flex flex-1 items-start gap-2 text-[13px] text-slate-400">
                        {item.info}
                      </p>
                      <div className="flex items-center justify-between border-t border-cyan-400/10 pt-4">
                        <span className="text-xs text-slate-400">Từ</span>
                        <span className="bg-[linear-gradient(135deg,#00d4ff,#0066ff)] bg-clip-text text-lg font-bold text-transparent">{item.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TicketListing;
