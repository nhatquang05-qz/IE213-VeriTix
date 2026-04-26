import { Link } from 'react-router-dom';
import { mockEvents } from '../data/mockEvents';

type TicketItem = {
  id: string;
  title: string;
  info: string;
  time: string;
  price: string;
  imageUrl: string;
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
  time: `Thời gian: ${event.startTime}`,
  price: `${event.price.toLocaleString('vi-VN')}đ`,
  imageUrl: event.imageUrl,
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
                item.external ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-inherit no-underline"
                  >
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(30,58,138,0.5)_0%,rgba(0,102,255,0.25)_100%)] transition hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-[0_12px_40px_rgba(0,102,255,0.3)]">
                      <div
                        className="relative h-40 w-full overflow-hidden"
                        style={{
                          backgroundImage: `linear-gradient(135deg, rgba(17, 24, 39, 0.25) 0%, rgba(3, 7, 18, 0.4) 100%), url(${item.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="mb-3 line-clamp-2 text-base leading-[1.3] font-semibold text-white">{item.title}</h3>
                        <p className="mb-4 flex flex-1 items-start gap-2 text-[13px] text-slate-400">
                          {item.info}
                        </p>
                        <p className="mb-4 flex flex-1 items-start gap-2 text-[13px] text-slate-400">
                          {item.time}
                        </p>
                        <div className="flex items-center justify-between border-t border-cyan-400/10 pt-4">
                          <span className="text-xs text-slate-400">Từ</span>
                          <span className="bg-[linear-gradient(135deg,#00d4ff,#0066ff)] bg-clip-text text-lg font-bold text-transparent">{item.price}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link key={item.id} to={`/events/${item.id}`} className="block text-inherit no-underline">
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(30,58,138,0.5)_0%,rgba(0,102,255,0.25)_100%)] transition hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-[0_12px_40px_rgba(0,102,255,0.3)]">
                      <div
                        className="relative h-40 w-full overflow-hidden"
                        style={{
                          backgroundImage: `linear-gradient(135deg, rgba(17, 24, 39, 0.25) 0%, rgba(3, 7, 18, 0.4) 100%), url(${item.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="mb-3 line-clamp-2 text-base leading-[1.3] font-semibold text-white">{item.title}</h3>
                        <p className="mb-4 flex flex-1 items-start gap-2 text-[13px] text-slate-400">
                          {item.info}
                        </p>
                        <p className="mb-4 flex flex-1 items-start gap-2 text-[13px] text-slate-400">
                          {item.time}
                        </p>
                        <div className="flex items-center justify-between border-t border-cyan-400/10 pt-4">
                          <span className="text-xs text-slate-400">Từ</span>
                          <span className="bg-[linear-gradient(135deg,#00d4ff,#0066ff)] bg-clip-text text-lg font-bold text-transparent">{item.price}</span>
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
