# 📊 Admin Dashboard - Hướng Dẫn Sử Dụng

## 🎯 Tổng Quan

Admin Dashboard là công cụ quản lý toàn hệ thống VeriTix, cho phép quản trị viên:
- Quản lý tài khoản người dùng
- Duyệt/từ chối sự kiện
- Xem thống kê hệ thống

## 📂 Cấu Trúc File

```
frontend/src/
├── components/admin/
│   ├── AdminHeader.tsx          # Header với menu account
│   └── AdminSidebar.tsx         # Sidebar navigation
├── pages/Admin/
│   ├── UserManagementPage.tsx   # Quản lý người dùng
│   ├── EventManagementPage.tsx  # Quản lý sự kiện
│   └── StatisticsPage.tsx       # Thống kê hệ thống
├── layouts/
│   └── AdminLayout.tsx          # Layout chính
├── mocks/
│   └── admin.mock.ts            # Mock data
└── constants/
    ├── routes.ts                # Routes admin
    └── sidebar.ts               # Admin navigation items
```

## 🚀 Cách Truy Cập

Admin Dashboard được truy cập qua URL: **`/admin`**

### Routes Con:
- **`/admin/users`** - Quản lý người dùng
- **`/admin/events`** - Quản lý sự kiện
- **`/admin/statistics`** - Thống kê hệ thống

## 📋 Chức Năng Chi Tiết

### 1️⃣ Quản Lý Người Dùng (`/admin/users`)

#### Tính Năng:
- **Hiển thị danh sách** - Xem tất cả người dùng trên hệ thống
- **Tìm kiếm** - Tìm kiếm theo tên hoặc email
- **Lọc theo vai trò** - Người dùng, Ban tổ chức, Admin
- **Lọc theo trạng thái** - Hoạt động, Bị khóa, Không hoạt động
- **Thay đổi trạng thái** - Thay đổi status của tài khoản
- **Xoá tài khoản** - Xoá tài khoản khỏi hệ thống
- **Thống kê** - Hiển thị tổng người dùng, ban tổ chức, hoạt động...

#### Giao Diện:
- Bảng hiển thị danh sách người dùng (responsive)
- Dropdown để lọc vai trò và trạng thái
- Thanh tìm kiếm
- Card thống kê

### 2️⃣ Quản Lý Sự Kiện (`/admin/events`)

#### Tính Năng:
- **Duyệt sự kiện** - Duyệt sự kiện chờ phê duyệt
- **Từ chối sự kiện** - Từ chối sự kiện không phù hợp
- **Xem chi tiết** - Xem thông tin chi tiết từng sự kiện
- **Tìm kiếm** - Tìm kiếm theo tên hoặc ban tổ chức
- **Lọc theo trạng thái** - Chờ duyệt, Đã duyệt, Từ chối, Đang diễn ra, Đã kết thúc
- **Thống kê sự kiện** - Tổng sự kiện, chờ duyệt, đã duyệt...

#### Thông Tin Hiển Thị:
- Tên sự kiện
- Ban tổ chức
- Trạng thái
- Ngày diễn ra
- Vé đã bán / Tổng vé
- Doanh thu
- Sức chứa
- Progress bar% vé đã bán

#### Trạng Thái Sự Kiện:
- 🟨 **Pending** - Chờ duyệt
- 🟢 **Approved** - Đã duyệt
- 🔴 **Rejected** - Từ chối
- 🔵 **Active** - Đang diễn ra
- ⚫ **Ended** - Đã kết thúc

### 3️⃣ Thống Kê Hệ Thống (`/admin/statistics`)

#### Chỉ Số Chính:
- **Tổng Người Dùng** - Số lượng người dùng trên hệ thống
- **Ban Tổ Chức** - Số lượng ban tổ chức
- **Tổng Sự Kiện** - Số lượng sự kiện
- **Sự Kiện Đang Diễn Ra** - Sự kiện active
- **Tổng Doanh Thu** - Tổng ETH nhận được
- **Vé Đã Bán** - Số lượng vé đã bán
- **Tổng Người Tham Gia** - Số người dự sự kiện
- **Phí Nền Tảng** - Doanh thu phí (5%)

#### Thống Kê Chi Tiết:
- **Doanh thu chi tiết** - Tổng doanh thu, phí nền tảng, cho nhà tổ chức
- **Top 5 Sự kiện nổi bật** - Bảng hiển thị các sự kiện có doanh thu cao nhất
- **Phân bố người dùng** - Biểu đồ người dùng vs ban tổ chức
- **Trạng thái sự kiện** - Biểu đồ sự kiện đang diễn ra vs hoàn tất
- **Thống kê tổng quát** - Các chỉ số tính toán (trung bình...)

## 🎨 Thiết Kế & UX

### Tính Năng Responsive
- **Desktop** (768px+): Sidebar mở rộng, hiển thị full layout
- **Mobile** (<768px): Sidebar ẩn, mở bằng hamburger menu
- **Tablet**: Layout linh hoạt 2 cột

### Màu Sắc & Theme
- **Primary**: Purple (#7c3aed) - Admin brand color
- **Success**: Emerald - Trạng thái hoạt động
- **Warning**: Yellow - Chờ duyệt
- **Danger**: Red - Từ chối, bị khóa
- **Info**: Blue - Thông tin
- **Background**: Dark (#070a11) - Theme tối

### Interaction
- Hover effects trên các element
- Smooth transitions & animations
- Toast notifications (có thể thêm)
- Modal dialogs (có thể thêm)

## 📊 Mock Data

Mock data được lưu trong `src/mocks/admin.mock.ts`:

### Dữ Liệu Người Dùng
- 8 người dùng mẫu
- Các vai trò khác nhau (user, organizer)
- Các trạng thái khác nhau (active, suspended, inactive)

### Dữ Liệu Sự Kiện
- 8 sự kiện mẫu
- Các trạng thái khác nhau
- Thông tin vé, doanh thu, sức chứa

### Dữ Liệu Thống Kê
- Tổng thống kê hệ thống
- Thống kê từng sự kiện

## 🔧 Cách Tích Hợp API

Để thay thế mock data bằng API thực:

### 1. Update UserManagementPage.tsx
```typescript
// Thay thế:
const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);

// Bằng:
const [users, setUsers] = useState<AdminUser[]>([]);
useEffect(() => {
  fetchUsers(); // Gọi API
}, []);

const fetchUsers = async () => {
  const response = await fetch('/api/admin/users');
  const data = await response.json();
  setUsers(data);
};
```

### 2. Update EventManagementPage.tsx
```typescript
// Tương tự với events
const [events, setEvents] = useState<AdminEvent[]>([]);
useEffect(() => {
  fetchEvents();
}, []);
```

### 3. Update StatisticsPage.tsx
```typescript
// Lấy stats từ API
useEffect(() => {
  fetchStatistics();
}, []);
```

## 📡 API Endpoints (Gợi ý)

```
GET    /api/admin/users              - Danh sách người dùng
POST   /api/admin/users              - Thêm người dùng
PUT    /api/admin/users/:id          - Cập nhật người dùng
DELETE /api/admin/users/:id          - Xoá người dùng

GET    /api/admin/events             - Danh sách sự kiện
PUT    /api/admin/events/:id/approve - Duyệt sự kiện
PUT    /api/admin/events/:id/reject  - Từ chối sự kiện

GET    /api/admin/statistics         - Thống kê hệ thống
GET    /api/admin/events/stats       - Thống kê sự kiện
```

## 🛡️ Bảo Mật (Authentication)

Để thêm bảo mật, hãy:
1. Kiểm tra role người dùng trước khi cho phép truy cập `/admin`
2. Thêm Auth guard trong route
3. Kiểm tra token JWT

### Ví dụ:
```typescript
// AdminLayout.tsx
useEffect(() => {
  const user = useContext(AuthContext);
  if (user?.role !== 'admin') {
    navigate('/login');
  }
}, []);
```

## 🚀 Tính Năng Mở Rộng (Future)

- [ ] Export dữ liệu (CSV, PDF)
- [ ] Biểu đồ nâng cao (Chart.js, Recharts)
- [ ] Phân trang (Pagination)
- [ ] Sort cột bảng
- [ ] Multi-select xoá
- [ ] Undo/Redo actions
- [ ] Activity log
- [ ] System notifications
- [ ] User feedback/support tickets
- [ ] Reports & Analytics advanced
- [ ] 2FA Management
- [ ] Blockchain monitoring

## 📝 Cách Chỉnh Sửa

### Thêm Cột Mới Vào Bảng Người Dùng
1. Cập nhật interface `AdminUser` trong `admin.mock.ts`
2. Thêm mock data
3. Thêm `<th>` và `<td>` trong bảng

### Thêm Filter Mới
1. Thêm state mới: `const [filterXxx, setFilterXxx] = useState()`
2. Cập nhật filter logic trong `filter*` function
3. Thêm `<select>` element

### Thay Đổi Màu Sắc
- Màu sắc được định nghĩa trong `getRoleColor()`, `getStatusColor()` functions
- Sử dụng Tailwind classes để thay đổi

## 🎓 Học Tập Thêm

- Tailwind CSS: https://tailwindcss.com
- React Icons: https://react-icons.github.io/react-icons/
- React Router: https://reactrouter.com/
- TypeScript: https://www.typescriptlang.org/

## 💡 Tips & Tricks

- Dùng `localStorage` để lưu filter preferences
- Dùng `SessionStorage` cho temporary data
- Debounce search input để tránh quá nhiều requests
- Thêm loading skeleton khi chờ API
- Thêm error handling cho tất cả API calls

## 📞 Support

Nếu có bất kỳ câu hỏi nào, hãy liên hệ với development team.
