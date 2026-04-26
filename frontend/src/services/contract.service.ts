import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return contract;
};

export const buyTicket = async (eventId: number, tokenURI: string, price: string) => {
  const contract = await getContract();
  
  const priceInWei = ethers.parseEther(price.toString()); 
  
  const tx = await contract.buyTicket(eventId, tokenURI, { value: priceInWei });
  return tx;
};