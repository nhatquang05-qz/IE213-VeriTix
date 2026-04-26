import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 py-14 pb-10">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10">
          <div>
            <h4 className="mb-5 text-base text-cyan-400">Sản Phẩm</h4>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Tìm Kiếm Vé</a>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Danh Mục Sự Kiện</a>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Ví Blockchain</a>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Ứng Dụng Mobile</a>
          </div>
          <div>
            <h4 className="mb-5 text-base text-cyan-400">Công Ty</h4>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Về VeriTix</a>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Đội Ngũ</a>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Tin Tức</a>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Liên Hệ</a>
          </div>
          <div>
            <h4 className="mb-5 text-base text-cyan-400">Tài Nguyên</h4>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Trung Tâm Trợ Giúp</a>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Hướng Dẫn Sử Dụng</a>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Blog</a>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">FAQ</a>
          </div>
          <div>
            <h4 className="mb-5 text-base text-cyan-400">Pháp Lý</h4>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Điều Khoản Dịch Vụ</a>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Chính Sách Bảo Mật</a>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Chính Sách Hoàn Tiền</a>
            <a href="#" className="mb-3 block text-sm text-slate-400 transition hover:text-cyan-300">Quy Định Sử Dụng</a>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 text-center text-sm text-slate-400">
          © 2024 VeriTix. Bảo lưu mọi quyền. Nền tảng bán vé trên blockchain.
        </div>
      </div>
    </footer>
  );
};

export default Footer;