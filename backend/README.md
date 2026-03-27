# 🚀 VeriTix Backend Tracking

Tài liệu này dùng để theo dõi tiến độ xây dựng API và Logic cho Backend của VeriTix.

## 🗂 Cấu trúc dự án hiện tại
- `src/config`: Cấu hình DB, Web3 Provider.
- `src/controllers`: Xử lý Request/Response.
- `src/middlewares`: Bảo mật, phân quyền, xử lý lỗi.
- `src/models`: Mongoose Schemas.
- `src/routes`: Express Router.
- `src/services`: Logic nghiệp vụ (Blockchain Listener, ...).
- `src/utils`: Hàm helpers dùng chung.

---

## 📝 Tiến độ công việc (Roadmap)

### Giai đoạn 1: Database & Nền tảng (Đang làm)
- [x] Khởi tạo dự án và kết nối MongoDB.
- [x] Thiết lập Blockchain Listener (Lắng nghe EventCreated).
- [ ] Cập nhật toàn bộ Models (`User`, `Event`, `Ticket`, `Transaction`) theo đặc tả mới.
- [ ] Thiết lập Global Error Handler Middleware.

### Giai đoạn 2: Xác thực & Phân quyền (Auth)
- [ ] API Đăng nhập/Đăng ký bằng MetaMask Wallet (`/api/auth/login`).
- [ ] Middleware kiểm tra JWT Token (`authMiddleware.js`).
- [ ] Cập nhật cờ `isOrganizer` tự động khi user tạo event.

### Giai đoạn 3: API Quản lý Sự kiện (Events)
- [ ] API Lấy danh sách sự kiện (Home page).
- [ ] API Xem chi tiết sự kiện + Dữ liệu On-chain.
- [ ] API Tạo metadata cho sự kiện (Lưu Banner, Description).
- [ ] API Dashboard thống kê cho Organizer (Doanh thu, số vé bán).

### Giai đoạn 4: Quản lý Vé & Giao dịch (Tickets & TX)
- [ ] Lắng nghe sự kiện `TicketBought` từ Blockchain -> Cập nhật DB.
- [ ] Lắng nghe sự kiện `TicketResold` từ Blockchain -> Cập nhật DB.
- [ ] API Lấy danh sách vé của tôi (My Tickets).

### Giai đoạn 5: Check-in & Bảo mật
- [ ] Logic sinh chữ ký số (Signature) tạo QR Code.
- [ ] API Quét mã QR xác thực Check-in.