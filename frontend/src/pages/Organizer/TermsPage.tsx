/* ══════════════════════════════════════════
   TermsPage — "Điều hành ban tổ chức"
   
   Sidebar cấp 1, mục cuối cùng.
   Hiển thị điều khoản + quy định vận hành dành cho organizer
   (nghĩa vụ, trách nhiệm, chính sách phí, bán lại, hoàn tiền...).
   
   Trang tĩnh — chỉ render nội dung, không gọi API.
   ══════════════════════════════════════════ */

interface TermSection {
  id: string;
  title: string;
  items: string[];
}

const TERM_SECTIONS: TermSection[] = [
  {
    id: 'responsibilities',
    title: 'Trách nhiệm của Ban tổ chức',
    items: [
      'Cung cấp đầy đủ, chính xác thông tin sự kiện: tên, mô tả, thời gian, địa điểm, số lượng vé, giá vé.',
      'Đảm bảo sự kiện diễn ra đúng như cam kết với người mua vé. Trường hợp thay đổi hoặc hủy, phải thông báo trước ít nhất 48 giờ.',
      'Chịu trách nhiệm về an toàn, an ninh và trải nghiệm của khách tham dự tại địa điểm tổ chức.',
      'Tuân thủ các quy định pháp luật Việt Nam về tổ chức sự kiện và phát hành vé điện tử.',
    ],
  },
  {
    id: 'ticket-policy',
    title: 'Chính sách vé NFT',
    items: [
      'Mỗi vé là một NFT duy nhất (ERC-721) trên Ethereum blockchain, được mint khi người mua thanh toán thành công.',
      'Giá vé gốc, số lượng tổng và phí bán lại tối đa đã ghi trên blockchain và không thể thay đổi sau khi sự kiện được phát hành.',
      'Ban tổ chức có thể chỉnh sửa metadata off-chain: mô tả, địa điểm, banner, thời gian chi tiết.',
      'Vé chỉ được sử dụng 1 lần duy nhất để check-in. Sau khi check-in, trạng thái được ghi nhận on-chain.',
    ],
  },
  {
    id: 'resell-policy',
    title: 'Chính sách bán lại vé',
    items: [
      'Người giữ vé có thể niêm yết bán lại trên VeriTix Marketplace với giá không vượt quá % phí bán lại tối đa do Ban tổ chức quy định.',
      'Ban tổ chức nhận một phần phí từ mỗi giao dịch bán lại thành công (royalty on-chain).',
      'Vé đã check-in hoặc sự kiện đã kết thúc không thể bán lại.',
    ],
  },
  {
    id: 'refund',
    title: 'Chính sách hoàn tiền',
    items: [
      'Trường hợp Ban tổ chức hủy sự kiện, toàn bộ người mua vé sẽ được hoàn tiền tự động qua smart contract.',
      'Ban tổ chức có trách nhiệm duy trì đủ số dư ETH trong ví để hoàn tiền khi cần thiết.',
      'Người mua vé không được hoàn tiền nếu không tham dự sự kiện vì lý do cá nhân.',
    ],
  },
  {
    id: 'fees',
    title: 'Phí nền tảng',
    items: [
      'VeriTix thu 2.5% phí nền tảng trên mỗi vé bán ra lần đầu.',
      'Gas fee phát sinh khi mint NFT do Ban tổ chức chi trả (deploy event) và người mua chi trả (mint vé).',
      'Các khoản phí được công bố minh bạch trên blockchain explorer.',
    ],
  },
  {
    id: 'violation',
    title: 'Vi phạm và chế tài',
    items: [
      'Ban tổ chức vi phạm điều khoản (lừa đảo, không tổ chức sự kiện, vi phạm pháp luật) sẽ bị khoá tài khoản và loại khỏi nền tảng.',
      'VeriTix có quyền giữ lại doanh thu để hoàn tiền cho người mua nếu phát sinh khiếu nại.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-[1100px] mx-auto animate-[fadeSlideUp_0.4s_ease]">
      {/* ── Title ── */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-[28px] font-extrabold text-white tracking-tight">
          Điều hành ban tổ chức
        </h1>
        <p className="text-[13px] text-slate-600 mt-1.5">
          Quy định và điều khoản áp dụng cho tất cả ban tổ chức trên VeriTix
        </p>
      </div>

      {/* ── Notice ── */}
      <div
        className="
            bg-sky-400/[0.04] border border-sky-400/[0.12] rounded-xl
            px-4 py-3.5 mb-6 flex items-start gap-3
          "
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="text-sky-400 shrink-0 mt-0.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="text-[13px] text-slate-400 leading-relaxed">
          <span className="font-semibold text-sky-300">Lưu ý:</span> Bằng việc tạo và phát hành sự
          kiện trên VeriTix, bạn đã đồng ý tuân thủ toàn bộ điều khoản dưới đây. Các điều khoản có
          thể được cập nhật theo thời gian và sẽ có hiệu lực sau 7 ngày thông báo.
        </p>
      </div>

      {/* ── Term sections ── */}
      <div className="flex flex-col gap-4">
        {TERM_SECTIONS.map((section, idx) => (
          <section
            key={section.id}
            className="bg-[#0d1117] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.1] transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="
                    w-8 h-8 rounded-lg flex items-center justify-center
                    bg-emerald-500/[0.08] border border-emerald-500/20
                    text-[13px] font-bold text-emerald-400 font-mono
                  "
              >
                {String(idx + 1).padStart(2, '0')}
              </div>
              <h2 className="text-[15px] font-bold text-white">{section.title}</h2>
            </div>

            <ul className="flex flex-col gap-2.5 pl-11">
              {section.items.map((item, i) => (
                <li
                  key={i}
                  className="
                      text-[13px] text-slate-400 leading-relaxed
                      relative before:absolute before:-left-4 before:top-[0.55em]
                      before:w-1 before:h-1 before:rounded-full before:bg-slate-600
                    "
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
        <p className="text-[11px] text-slate-700 uppercase tracking-[0.18em]">
          VeriTix · Phiên bản điều khoản 1.0 · Cập nhật lần cuối: 2026
        </p>
      </div>
    </div>
  );
}
