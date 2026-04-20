import React from 'react';

const Footer: React.FC = () => {
  const headingClass =
    'mb-9 text-base text-[#00d4ff] max-[768px]:mb-[22px] max-[768px]:text-[15px] max-[480px]:mb-[16px]';
  const linkClass =
    'mb-5 block text-sm leading-[1.75] text-[#ffffff] transition-colors duration-300 hover:text-[#ffffff] max-[768px]:mb-4 max-[768px]:text-[13px] max-[768px]:leading-[1.7] max-[480px]:mb-3';

  return (
    <footer className="border-t border-white/10 py-[60px] pb-10 max-[1024px]:py-[52px] max-[1024px]:pb-[34px] max-[768px]:py-[44px] max-[768px]:pb-7 max-[480px]:py-9 max-[480px]:pb-[22px]">
      <div className="mx-auto max-w-[1440px] px-5 max-[768px]:px-4">
        <div className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-10 max-[1024px]:mb-[30px] max-[1024px]:gap-7 max-[768px]:mb-6 max-[768px]:grid-cols-2 max-[768px]:gap-y-[22px] max-[768px]:gap-x-[18px] max-[480px]:mb-5 max-[480px]:grid-cols-1 max-[480px]:gap-[18px]">
          <div className="max-[480px]:pb-[2px]">
            <h4 className={headingClass}>Sản Phẩm</h4>
            <a href="#" className={linkClass}>Tìm Kiếm Vé</a>
            <a href="#" className={linkClass}>Danh Mục Sự Kiện</a>
            <a href="#" className={linkClass}>Ví Blockchain</a>
            <a href="#" className={linkClass}>Ứng Dụng Mobile</a>
          </div>
          <div className="max-[480px]:pb-[2px]">
            <h4 className={headingClass}>Công Ty</h4>
            <a href="#" className={linkClass}>Về VeriTix</a>
            <a href="#" className={linkClass}>Đội Ngũ</a>
            <a href="#" className={linkClass}>Tin Tức</a>
            <a href="#" className={linkClass}>Liên Hệ</a>
          </div>
          <div className="max-[480px]:pb-[2px]">
            <h4 className={headingClass}>Tài Nguyên</h4>
            <a href="#" className={linkClass}>Trung Tâm Trợ Giúp</a>
            <a href="#" className={linkClass}>Hướng Dẫn Sử Dụng</a>
            <a href="#" className={linkClass}>Blog</a>
            <a href="#" className={linkClass}>FAQ</a>
          </div>
          <div className="max-[480px]:pb-[2px]">
            <h4 className={headingClass}>Pháp Lý</h4>
            <a href="#" className={linkClass}>Điều Khoản Dịch Vụ</a>
            <a href="#" className={linkClass}>Chính Sách Bảo Mật</a>
            <a href="#" className={linkClass}>Chính Sách Hoàn Tiền</a>
            <a href="#" className={linkClass}>Quy Định Sử Dụng</a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-[30px] text-center text-sm text-[#a0aec0] max-[768px]:pt-5 max-[768px]:text-[13px] max-[768px]:leading-[1.6] max-[480px]:pt-4 max-[480px]:text-xs">
          © 2024 VeriTix. Bảo lưu mọi quyền. Nền tảng bán vé trên blockchain.
        </div>
      </div>
    </footer>
  );
};

export default Footer;