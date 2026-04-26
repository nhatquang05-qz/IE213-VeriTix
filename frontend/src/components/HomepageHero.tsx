const HomepageHero = () => {
  return (
    <section className="relative overflow-hidden px-0 pt-20 pb-[120px]">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(0, 212, 255, 0.1) 1px, transparent 1px), radial-gradient(circle at 90% 80%, rgba(0, 102, 255, 0.08) 1px, transparent 1px), radial-gradient(circle at 50% 10%, rgba(0, 212, 255, 0.06) 1px, transparent 1px), radial-gradient(circle at 20% 90%, rgba(0, 102, 255, 0.04) 1px, transparent 1px), radial-gradient(circle at 80% 40%, rgba(0, 212, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '100px 100px, 150px 150px, 200px 200px, 120px 120px, 180px 180px',
          opacity: 0.45,
        }}
      />
      <canvas className="pointer-events-none absolute inset-0 z-[1] opacity-15" id="blockchainCanvas"></canvas>
      
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-32 pb-20"> 
        <div className="text-center">
          <h1 className="mb-6 bg-[linear-gradient(135deg,#ffffff_0%,#00d4ff_100%)] bg-clip-text text-[64px] leading-[1.1] font-extrabold text-transparent md:text-[40px]">
            Bán Vé Bảo Mật<br />Trên Blockchain
          </h1>
          <p className="mx-auto mb-12 max-w-[600px] text-xl leading-[1.6] text-slate-400">
            Trải nghiệm tương lai của vé sự kiện với xác thực blockchain và thanh toán số liền mạch
          </p>

          <div className="relative mx-auto mt-[60px] max-w-[900px] overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#1e3a8a_0%,#0066ff_100%)] p-12 shadow-[0_20px_60px_rgba(0,102,255,0.4)] md:p-6">
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.3)_0%,transparent_70%)] blur-3xl" />
            <div className="relative grid grid-cols-[1fr_auto] items-center gap-10 md:grid-cols-1">
              <div>
                <h3 className="mb-3 text-sm tracking-[2px] text-slate-300 uppercase">Truy Cập Sự Kiện Đã Xác Thực</h3>
                <p className="text-base leading-[1.6] text-white/80">
                  Mỗi vé được bảo vệ bởi công nghệ blockchain, đảm bảo tính xác thực và không thể làm giả. Trải nghiệm an toàn tuyệt đối cho mọi sự kiện.
                </p>
              </div>
              <div className="relative h-[120px] w-[120px]">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="2" />
                  <circle cx="60" cy="60" r="35" fill="none" stroke="rgba(0, 212, 255, 0.5)" strokeWidth="2" />
                  <circle cx="60" cy="60" r="20" fill="rgba(0, 212, 255, 0.2)" stroke="#00d4ff" strokeWidth="3" />
                  <circle cx="60" cy="20" r="8" fill="#00d4ff" />
                  <circle cx="95" cy="60" r="8" fill="#00d4ff" />
                  <circle cx="60" cy="100" r="8" fill="#00d4ff" />
                  <circle cx="25" cy="60" r="8" fill="#00d4ff" />
                  <line x1="60" y1="28" x2="60" y2="52" stroke="#00d4ff" strokeWidth="2" />
                  <line x1="87" y1="60" x2="68" y2="60" stroke="#00d4ff" strokeWidth="2" />
                  <line x1="60" y1="92" x2="60" y2="68" stroke="#00d4ff" strokeWidth="2" />
                  <line x1="33" y1="60" x2="52" y2="60" stroke="#00d4ff" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageHero;