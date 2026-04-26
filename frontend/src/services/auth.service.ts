import axiosClient from '../utils/axiosClient';

export const authService = {
  // Lấy mã Nonce từ Backend
  getNonce: async (walletAddress: string) => {
    const response = await axiosClient.get(`/api/auth/nonce/${walletAddress}`);
    return response.data.nonce;
  },

  // Gửi chữ ký để xác thực và nhận Token
  verifySignature: async (walletAddress: string, signature: string) => {
    const response = await axiosClient.post('/api/auth/verify', {
      walletAddress,
      signature
    });
    return response.data; // Trả về { token, user, message }
  }
};