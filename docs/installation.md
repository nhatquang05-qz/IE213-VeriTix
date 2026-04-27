# Hướng dẫn cài đặt và khởi chạy - VeriTix

Tài liệu này hướng dẫn cách thiết lập và chạy dự án VeriTix trên môi trường máy tính cá nhân (Local).

## 1. Yêu cầu hệ thống
- **Node.js:** Phiên bản 18.x trở lên.
- **Trình duyệt:** Chrome/Brave/Edge có cài đặt tiện ích mở rộng **MetaMask**.
- **Cơ sở dữ liệu:** Một cluster MongoDB Atlas (đã cấu hình Network Access là `0.0.0.0/0`).
- **Cloudinary:** Tài khoản Cloudinary để lưu trữ ảnh sự kiện.

---

## 2. Thiết lập Smart Contract (Blockchain)

Mở terminal và di chuyển vào thư mục `blockchain`:

```bash
cd blockchain
npm install
```

Tạo file `.env` theo mẫu sau:
```env
# RPC URL của mạng Sepolia (từ Infura hoặc Alchemy)
SEPOLIA_RPC_URL=[https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY](https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY)
# Private key của ví có chứa Sepolia ETH dùng để deploy
PRIVATE_KEY=your_private_key_here
```

Biên dịch và triển khai hợp đồng:
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```
*(Sau khi deploy thành công, hãy copy địa chỉ hợp đồng in ra trên màn hình để dùng cho Frontend).*

---

## 3. Thiết lập Máy chủ API (Backend)

Mở terminal mới và di chuyển vào thư mục `backend`:

```bash
cd backend
npm install
```

Tạo file `.env` theo mẫu:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/veritix
JWT_SECRET=mot_chuoi_bi_mat_bat_ky_dai_chut_cho_an_toan
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Khởi chạy server:
```bash
npm start
```
*Server sẽ chạy mặc định tại `http://localhost:5000`.*

---

## 4. Thiết lập Giao diện (Frontend)

Mở terminal mới và di chuyển vào thư mục `frontend`:

```bash
cd frontend
npm install
```

Tạo file `.env` theo mẫu:
```env
VITE_API_URL=http://localhost:5000/api
```

Cập nhật địa chỉ Smart Contract:
Mở file `src/config/contract.ts` và thay giá trị của biến `CONTRACT_ADDRESS` bằng địa chỉ hợp đồng bạn vừa triển khai ở Bước 2.

Khởi chạy ứng dụng web:
```bash
npm run dev
```

Truy cập `http://localhost:5173` trên trình duyệt để bắt đầu trải nghiệm hệ thống!