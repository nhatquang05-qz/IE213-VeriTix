const BlockchainTrust = () => {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(0,102,255,0.1)_0%,rgba(0,212,255,0.05)_100%)] py-[120px]">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-2 items-center gap-20 text-[#c4d6ef] md:grid-cols-1 md:gap-10">
          <div>
            <h2 className="mb-6 text-[42px] leading-[1.2]">
              Xây Dựng Trên Niềm Tin<br />Vận Hành Bởi Blockchain
            </h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-400">
              VeriTix sử dụng công nghệ blockchain phi tập trung để đảm bảo mỗi giao dịch đều minh bạch, an toàn và không thể thay đổi. Hệ thống của chúng tôi loại bỏ hoàn toàn vé giả, gian lận và đảm bảo quyền lợi tối đa cho người dùng.
            </p>
            <p className="text-base leading-[1.8] text-slate-400">
              Với mạng lưới node toàn cầu, mọi vé được xác minh trong vài giây, mang đến trải nghiệm mua vé nhanh chóng và đáng tin cậy nhất.
            </p>
          </div>

          <div className="relative h-[400px]">
            <div className="absolute top-[20%] left-[10%] flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0066ff,#00d4ff)] shadow-[0_0_40px_rgba(0,212,255,0.6),0_0_80px_rgba(0,212,255,0.3)]">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="white" opacity="0.2" />
                <circle cx="20" cy="20" r="8" fill="white" />
              </svg>
            </div>
            <div className="absolute top-[10%] right-[20%] flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0066ff,#00d4ff)] shadow-[0_0_40px_rgba(0,212,255,0.6),0_0_80px_rgba(0,212,255,0.3)]">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="white" opacity="0.2" />
                <circle cx="20" cy="20" r="8" fill="white" />
              </svg>
            </div>
            <div className="absolute bottom-[30%] left-[20%] flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0066ff,#00d4ff)] shadow-[0_0_40px_rgba(0,212,255,0.6),0_0_80px_rgba(0,212,255,0.3)]">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="white" opacity="0.2" />
                <circle cx="20" cy="20" r="8" fill="white" />
              </svg>
            </div>
            <div className="absolute right-[15%] bottom-[20%] flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0066ff,#00d4ff)] shadow-[0_0_40px_rgba(0,212,255,0.6),0_0_80px_rgba(0,212,255,0.3)]">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="white" opacity="0.2" />
                <circle cx="20" cy="20" r="8" fill="white" />
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 flex h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0066ff,#00d4ff)] shadow-[0_0_60px_rgba(0,212,255,0.8),0_0_120px_rgba(0,212,255,0.4)]">
              <svg width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="white" opacity="0.2" />
                <circle cx="25" cy="25" r="10" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainTrust;
