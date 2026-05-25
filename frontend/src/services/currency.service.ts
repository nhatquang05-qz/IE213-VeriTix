const CACHE_KEY = 'eth_to_vnd_rate';
const CACHE_DURATION = 15 * 60 * 1000;

export const getEthToVndRate = async (): Promise<number> => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { rate, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();
      
      if (now - timestamp < CACHE_DURATION) {
        return rate;
      }
    }

    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=vnd');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rate = data.ethereum.vnd;

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      rate,
      timestamp: new Date().getTime()
    }));

    return rate;
  } catch (error) {
    console.warn("Lỗi đồng bộ tỷ giá ETH. Đang chuyển sang sử dụng dữ liệu dự phòng:", error);
    
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData).rate;
    }
    
    return 60000000;
  }
};