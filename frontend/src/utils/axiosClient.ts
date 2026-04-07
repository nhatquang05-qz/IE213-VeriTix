import axios from 'axios';

// Khởi tạo một bản sao của axios với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000', // Đổi cổng backend nếu cần
  headers: {
    'Content-Type': 'application/json',
  },
});

// gửi cấu hình Interceptor cho REQUEST 
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Cấu hình Interceptor cho RESPONSE 
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // lỗi 401
    if (error.response?.status === 401) {
      console.error("Lỗi 401: Chưa đăng nhập hoặc Token hết hạn!");
      // phát triển thêm logic xử lý lỗi 401 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;