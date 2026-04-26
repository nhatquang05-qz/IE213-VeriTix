const features = [
  {
    title: 'Bảo Mật Blockchain',
    description:
      'Mỗi vé được mã hóa và lưu trữ trên blockchain, đảm bảo an toàn tuyệt đối và không thể bị xâm nhập hay làm giả.',
    iconPath:
      'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z',
  },
  {
    title: 'Xác Thực Tức Thì',
    description:
      'Xác minh tính hợp lệ của vé trong vài giây với công nghệ blockchain, giúp bạn yên tâm trước mọi giao dịch.',
    iconPath:
      'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
  },
  {
    title: 'Thanh Toán Crypto',
    description:
      'Hỗ trợ đa dạng phương thức thanh toán bằng tiền điện tử, mang đến sự tiện lợi và bảo mật cao nhất cho người dùng.',
    iconPath:
      'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z',
  },
  {
    title: 'Không Vé Giả',
    description:
      'Công nghệ blockchain loại bỏ hoàn toàn khả năng làm giả vé, bảo vệ bạn khỏi mọi rủi ro gian lận trong giao dịch.',
    iconPath:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  },
  {
    title: 'Ưu Đãi Sinh Viên',
    description:
      'Chương trình giảm giá đặc biệt dành cho sinh viên và người trẻ, giúp bạn tận hưởng sự kiện yêu thích với mức giá tốt nhất.',
    iconPath:
      'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  },
  {
    title: 'Chuyển Nhượng Nhanh',
    description:
      'Chuyển vé cho bạn bè chỉ trong vài giây với hệ thống blockchain nhanh chóng, an toàn và minh bạch hoàn toàn.',
    iconPath:
      'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-white/2 py-[100px]">
      <div className="mx-auto max-w-[1400px] px-6">
        <h2 className="mb-[60px] text-center text-[42px] font-bold text-slate-400">Tại Sao Chọn VeriTix</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative overflow-hidden rounded-[20px] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(30,58,138,0.3)_0%,rgba(0,102,255,0.1)_100%)] px-8 py-10 transition hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-[0_20px_40px_rgba(0,102,255,0.3)]"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0066ff_0%,#00d4ff_100%)] shadow-[0_8px_24px_rgba(0,102,255,0.3)]">
                <svg className="h-8 w-8 fill-white" viewBox="0 0 24 24">
                  <path d={feature.iconPath} />
                </svg>
              </div>
              <h3 className="mb-3 text-xl text-white">{feature.title}</h3>
              <p className="text-[15px] leading-[1.6] text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
