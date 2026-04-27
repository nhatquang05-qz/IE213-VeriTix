# Tài liệu API - VeriTix

Tài liệu này liệt kê các điểm cuối (endpoints) API được sử dụng trong hệ thống VeriTix.

## Base URL
- **Local:** `http://localhost:5000/api`
- **Production (Vercel):** `https://veritix-sepia.vercel.app/api`

---

## 1. Authentication (`/auth`)
Sử dụng chữ ký số từ ví MetaMask để xác thực người dùng thay cho mật khẩu truyền thống.

### Lấy Nonce
- **Endpoint:** `POST /auth/nonce`
- **Body:** `{ "walletAddress": "string" }`
- **Mô tả:** Trả về một chuỗi ngẫu nhiên (nonce) để người dùng ký bằng ví nhằm chống tấn công Replay Attack.

### Xác thực chữ ký
- **Endpoint:** `POST /auth/verify`
- **Body:** `{ "walletAddress": "string", "signature": "string" }`
- **Mô tả:** Kiểm tra chữ ký hợp lệ từ Smart Contract/Ethers và trả về JWT Token.

---

## 2. Sự kiện (`/events`)

### Danh sách sự kiện
- **Endpoint:** `GET /events`
- **Mô tả:** Lấy danh sách tất cả các sự kiện đang diễn ra, có hỗ trợ phân trang và lọc theo trạng thái.

### Chi tiết sự kiện
- **Endpoint:** `GET /events/:id`
- **Mô tả:** Lấy thông tin chi tiết của một sự kiện theo ID (MongoDB ID).

### Tạo sự kiện
- **Endpoint:** `POST /events`
- **Header:** `Authorization: Bearer <token>` (Yêu cầu quyền Organizer)
- **Body:** `{ "name", "description", "price", "maxSupply", "startTime", "bannerUrl", "blockchainId" }`
- **Mô tả:** Lưu thông tin metadata sự kiện xuống DB sau khi đã tạo thành công trên blockchain Sepolia.

---

## 3. Vé & Giao dịch (`/tickets`)

### Vé của tôi
- **Endpoint:** `GET /tickets/my-tickets`
- **Header:** `Authorization: Bearer <token>`
- **Mô tả:** Lấy danh sách chi tiết các vé mà ví hiện tại đang sở hữu để hiển thị QR Code.

### Lưu thông tin vé (Mua vé)
- **Endpoint:** `POST /tickets`
- **Header:** `Authorization: Bearer <token>`
- **Body:** `{ "eventId", "transactionHash", "price", "blockchainTicketIds": [1, 2] }`
- **Mô tả:** Ghi nhận thông tin vé và tạo lịch sử Transaction sau khi giao dịch Mint trên blockchain thành công.

### Soát vé (Check-in)
- **Endpoint:** `POST /tickets/checkin`
- **Header:** `Authorization: Bearer <token>` (Yêu cầu quyền Organizer của sự kiện đó)
- **Body:** `{ "blockchainTicketId", "timestamp", "signature" }`
- **Mô tả:** Xác thực mã QR được sinh ra từ thiết bị của khách hàng, chống làm giả vé và đổi trạng thái vé thành `USED`.

---

## 4. Upload Ảnh (`/upload`)

### Tải ảnh lên Cloudinary
- **Endpoint:** `POST /upload`
- **Body:** `FormData` (chứa file ảnh từ input)
- **Mô tả:** Tiếp nhận file từ Frontend, nén file và tải lên Cloudinary, trả về URL HTTPS.