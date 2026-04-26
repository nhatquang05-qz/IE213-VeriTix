import { Link } from 'react-router-dom';

type TicketItem = {
  id: string;
  title: string;
  info: string;
  price: string;
};

type TicketCategory = {
  name: string;
  items: TicketItem[];
};

const categories: TicketCategory[] = [
  {
    name: 'Âm Nhạc & Concert',
    items: [
      { id: '1', title: 'GAI HOME CONCERT', info: 'TP. Hồ Chí Minh • 16/05/2026', price: '1.000.000đ' },
      { id: '2', title: 'Mr Siro - Fan Concert - Encore Ai Cũng Giấu Trong Lòng', info: 'TP. Hồ Chí Minh • 30/04/2026', price: '800.000đ' },
      { id: '3', title: 'BÙI CÔNG NAM "THE STORY" LIVETOUR', info: 'TP. Hồ Chí Minh • 20/06/2026', price: '900.000đ' },
      { id: '4', title: 'Bùi Lan Hương FANCON', info: 'Hà Nội • 26/04/2026', price: '700.000đ' },
      { id: '5', title: 'SPARK NITE: S.T SƠN THẠCH x NEKO LÊ', info: 'TP. Hồ Chí Minh • 15/05/2026', price: '650.000đ' },
      { id: '6', title: 'SUN SONG - THE NEW BEGINNING', info: 'Hà Nội • 06/06/2026', price: '888.000đ' },
      { id: '7', title: 'HBAShow: Phai Dấu Cuộc Tình - Quang Vinh', info: 'TP. Hồ Chí Minh • 09/05/2026', price: '600.000đ' },
      { id: '8', title: 'Private Quốc Thiên in Fantasy Show', info: 'TP. Hồ Chí Minh • 09/05/2026', price: '800.000đ' },
    ],
  },
  {
    name: 'Sân Khấu & Nghệ Thuật',
    items: [
      { id: '9', title: '[Nhà Hát Bến Thành] Hài kịch: Đảo Hoa Hậu', info: 'TP. Hồ Chí Minh • 26/04/2026', price: '400.000đ' },
      { id: '10', title: 'SÂN KHẤU THIÊN ĐĂNG: NGÔI NHÀ KHÔNG CÓ ĐÀN ÔNG', info: 'Hà Nội • 27/04/2026', price: '330.000đ' },
      { id: '11', title: 'Ký Ức Hội An - Hoi An Memories Show', info: 'Hội An • 27/04/2026', price: '300.000đ' },
      { id: '12', title: 'Sân Khấu Thế Giới Trẻ: Gánh Hát Về Khuya', info: 'TP. Hồ Chí Minh • 26/04/2026', price: '330.000đ' },
      { id: '13', title: 'Sân Khấu Hồng Vân: Vở Kịch Người Vợ Ma', info: 'TP. Hồ Chí Minh • 26/04/2026', price: '300.000đ' },
      { id: '14', title: '[Nhà Hát Kịch Thanh Niên] Hài kịch: Nữ Hoàng Giải Trí', info: 'Hà Nội • 17/05/2026', price: '350.000đ' },
    ],
  },
  {
    name: 'Hội Thảo & Workshop',
    items: [
      { id: '15', title: '[DẾ GARDEN] Moss Frame Workshop', info: 'TP. Hồ Chí Minh • 29/04/2026', price: '450.000đ' },
      { id: '16', title: '[DẾ GARDEN] Stress Breaker Workshop', info: 'TP. Hồ Chí Minh • 30/04/2026', price: '375.000đ' },
      { id: '17', title: '[LEMLAB] Workshop TRẢI NGHIỆM LÀM GỐM', info: 'TP. Hồ Chí Minh • 26/04/2026', price: '400.000đ' },
      { id: '18', title: '(FLOWER 1969\'s) WORKSHOP CANDLE - HỌC LÀM NẾN THƠM', info: 'TP. Hồ Chí Minh • 26/04/2026', price: '279.000đ' },
    ],
  },
  {
    name: 'Thể Thao & Giải Trí',
    items: [
      { id: '19', title: 'VCT Pacific Stage 1 Finals: Ho Chi Minh', info: 'TP. Hồ Chí Minh • 26/04/2026', price: '200.000đ' },
      { id: '20', title: 'ĐUA XE GO-KART CITY PARK', info: 'TP. Hồ Chí Minh • 20/04/2026', price: '342.000đ' },
      { id: '21', title: '[Metashow] Triển Lãm Nghệ Thuật Ánh Sáng', info: 'TP. Hồ Chí Minh • 26/04/2026', price: '150.000đ' },
      { id: '22', title: 'CHUNG KẾT ĐẤU TRƯỜNG DANH VỌNG 2026', info: 'TP. Hồ Chí Minh • 10/05/2026', price: '79.000đ' },
    ],
  },
  {
    name: 'Tham Quan & Trải Nghiệm',
    items: [
      { id: '23', title: 'TOUR ĐÊM VĂN MIẾU - VAN MIEU NIGHT TOUR', info: 'Hà Nội • 25/04/2026', price: '250.000đ' },
      { id: '24', title: 'Trải Nghiệm Bay Dù Lượn Mù Cang Chải', info: 'Yên Bái • 01/05/2026', price: '2.190.000đ' },
      { id: '25', title: 'Sự kiện Tiệc Cưới Sensation of I DO', info: 'TP. Hồ Chí Minh • 01/05/2026', price: '700.000đ' },
      { id: '26', title: 'VinWonders Nha Trang', info: 'Nha Trang • 19/05/2026', price: '500.000đ' },
    ],
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
                <Link key={item.id} to={`/events/${item.id}`} className="ticket-card-link">
                  <div className="ticket-card">
                    <div className="ticket-card-image"></div>
                    <div className="ticket-card-body">
                      <h3 className="ticket-card-title">{item.title}</h3>
                      <p className="ticket-card-info">
                        <span className="info-icon">📍</span> {item.info}
                      </p>
                      <div className="ticket-card-price">
                        <span className="price-label">Từ</span>
                        <span className="price-value">{item.price}</span>
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
