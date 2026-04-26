export const getEthToVndRate = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=vnd');
    const data = await response.json();
    return data.ethereum.vnd;
  } catch (error) {
    return 80000000;
  }
};