import axios from 'axios';

// Khởi tạo một bản sao của axios với cấu hình mặc định
const axiosClient = axios.create({
  // Lấy từ file .env, nếu không có thì fallback về localhost:5000/api
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cấu hình Interceptor cho REQUEST 
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
      // TODO: Thêm logic điều hướng về trang Login hoặc xóa token ở đây
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const optimizeCloudinaryUrl = (url: string, width: number = 800) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
};

export default axiosClient;