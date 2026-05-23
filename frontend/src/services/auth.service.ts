import axiosClient from '../utils/axiosClient';

export const authService = {
  getNonce: async (walletAddress: string) => {
    const response = await axiosClient.get(`/auth/nonce/${walletAddress}`);
    return response.data.nonce;
  },

  verifySignature: async (walletAddress: string, signature: string) => {
    const response = await axiosClient.post('/auth/verify', {
      walletAddress,
      signature
    });
    return response.data;
  }
};