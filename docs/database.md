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