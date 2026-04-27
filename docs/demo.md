# Kịch bản Demo & Chạy thử Hệ thống VeriTix

Tài liệu này mô tả các bước thao tác thực tế để báo cáo đồ án hoặc trình bày chức năng của hệ thống VeriTix.

##  Khâu chuẩn bị
- Đảm bảo ví MetaMask đã chuyển mạng sang **Sepolia Testnet**.
- Cần có ít nhất 2 ví MetaMask:
  - **Ví 1 (Organizer):** Dùng để đăng ký làm Ban tổ chức và tạo sự kiện.
  - **Ví 2 (User):** Dùng để đóng vai khách hàng mua vé.
- Chuẩn bị sẵn một ít Sepolia ETH trong ví (nhận từ Sepolia Faucet).

---

## Kịch bản 1: Đăng nhập và Xin quyền Ban Tổ Chức
1. Truy cập trang chủ VeriTix, bấm nút **Kết nối ví** ở góc phải màn hình.
2. Tiện ích MetaMask sẽ hiện lên yêu cầu Ký (Sign) một tin nhắn định danh. Quá trình này không tốn phí Gas.
3. Sau khi kết nối, vào **Dashboard** -> Bấm **Đăng ký làm đối tác tổ chức**.
4. Hệ thống cập nhật quyền Organizer, thanh Sidebar bên trái sẽ hiển thị đầy đủ các tính năng quản lý sự kiện.

---

## Kịch bản 2: Phát hành Sự kiện Web3
1. Sử dụng **Ví 1**, vào mục **Sự kiện của tôi** -> **Tạo sự kiện mới**.
2. Upload ảnh Banner, điền Tên sự kiện, Thời gian và Địa điểm.
3. Chuyển sang bước cấu hình vé: Nhập **Giá vé** (đơn vị ETH) và **Số lượng tối đa** (Max Supply).
4. Bấm **Phát hành**. 
5. Xác nhận giao dịch trên MetaMask để ghi dữ liệu lên mạng lưới Sepolia (sẽ tốn một ít phí Gas).
6. Đợi khoảng 10-15s, thông báo "Giao dịch thành công" xuất hiện. Sự kiện lập tức được hiển thị trên Trang chủ.

---

## Kịch bản 3: Trải nghiệm Mua vé của Khách hàng
1. Chuyển MetaMask sang **Ví 2** (User) và F5 tải lại trang.
2. Ở Trang chủ, bấm vào sự kiện vừa tạo ở Kịch bản 2 để xem chi tiết.
3. Chọn số lượng vé muốn mua (Tối đa 3 vé/lần theo logic Smart Contract) và bấm **Mua ngay**.
4. MetaMask sẽ yêu cầu thanh toán tổng giá trị vé bằng ETH. Bấm **Xác nhận**.
5. Sau khi giao dịch đào thành công (Mining), hệ thống Backend tự động ghi nhận lịch sử giao dịch và cấp NFT Ticket.
6. Người dùng truy cập mục **Vé của tôi**, sẽ thấy các vé vừa mua kèm mã **QR Code động**.

---

## Kịch bản 4: Check-in bằng QR Code Chống Giả Mạo
1. Mở màn hình máy tính đóng vai Ban tổ chức (**Ví 1**), vào **Dashboard** -> **Sự kiện của tôi** -> Chọn sự kiện -> Bấm vào tab **Check-in**.
2. Dùng điện thoại di động (hoặc mở 1 tab khác) đóng vai khách hàng (**Ví 2**), mở mục **Vé của tôi** và hiển thị QR Code của vé.
3. Ở màn hình Ban tổ chức, nhập mã Token ID (hoặc dùng thiết bị quét QR).
4. Hệ thống API sẽ gọi hàm giải mã chữ ký (Ethers verifyMessage) để kiểm tra:
   - Vé có đúng của sự kiện này không?
   - Mã QR có còn hạn (dưới 5 phút) không?
   - Chữ ký có đúng là của người đang giữ vé (Owner) không?
5. Nếu hợp lệ, vé được đổi trạng thái thành `USED` (Đã sử dụng) và không thể check-in lại lần hai.
4. File docs/database.md (Tài liệu Thiết kế DB)
Markdown
# Thiết kế Cơ sở dữ liệu (Database Design)

Hệ thống VeriTix sử dụng kiến trúc dữ liệu lai (Hybrid) giữa **MongoDB (NoSQL)** để lưu trữ metadata truy xuất nhanh và **Blockchain (Ethereum/Sepolia)** để lưu trữ quyền sở hữu bất biến.

Dưới đây là cấu trúc các bảng (Collections) trong MongoDB.

## 1. Bảng Users (Người dùng)
Quản lý thông tin và phân quyền dựa trên địa chỉ ví (Wallet Address).

- `_id`: ObjectId (PK)
- `walletAddress`: String (Unique, Indexed - Địa chỉ MetaMask, lowercase)
- `email`: String (Tùy chọn)
- `fullName`: String (Mặc định: "Anonymous")
- `isOrganizer`: Boolean (Cờ đánh dấu quyền Ban tổ chức)
- `isAdmin`: Boolean (Cờ đánh dấu quyền Quản trị viên hệ thống)
- `nonce`: String (Mã sinh ngẫu nhiên để xác thực JWT chống Replay Attack)

## 2. Bảng Events (Sự kiện)
Lưu trữ thông tin chi tiết các sự kiện để giảm tải việc gọi RPC từ Frontend lên Blockchain.

- `_id`: ObjectId (PK)
- `blockchainId`: Number (Unique - ID tương ứng trên Smart Contract)
- `organizerWallet`: String (FK -> Users.walletAddress)
- `name`: String (Tên sự kiện)
- `description`: String (Nội dung chi tiết)
- `startTime`: Date (Thời gian diễn ra)
- `price`: String (Giá vé gốc, lưu dạng Wei)
- `maxSupply`: Number (Giới hạn số lượng vé)
- `currentMinted`: Number (Số vé đã bán ra)
- `bannerUrl`: String (Link ảnh từ Cloudinary)
- `status`: Enum `['DRAFT', 'ACTIVE', 'ENDED', 'CANCELLED']`
- `isOnChain`: Boolean (Cờ xác nhận sự kiện đã thực sự lên mạng lưới)

## 3. Bảng Tickets (Vé Sự kiện)
Quản lý trạng thái vòng đời của một vé sau khi được người dùng đúc (Mint).

- `_id`: ObjectId (PK)
- `blockchainTicketId`: Number (Unique - Token ID của NFT)
- `eventId`: ObjectId (FK -> Events._id)
- `ownerWallet`: String (FK -> Users.walletAddress - Ví đang giữ vé)
- `purchasePrice`: String (Giá lúc mua)
- `status`: Enum `['AVAILABLE', 'SOLD', 'RESELLING', 'USED']`

## 4. Bảng Transactions (Giao dịch)
Ghi nhận lịch sử dòng tiền và sự thay đổi quyền sở hữu vé.

- `_id`: ObjectId (PK)
- `txHash`: String (Unique - Hash giao dịch trên Etherscan)
- `type`: Enum `['MINT', 'RESELL', 'CHECKIN']` (Loại hành động)
- `fromWallet`: String (Người gửi/Người mua)
- `toWallet`: String (Người nhận/Ban tổ chức)
- `amount`: String (Số ETH/Wei giao dịch)