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

export const buyTicket = async (eventId: number, tokenURI: string, priceInEth: string) => {
  const contract = await getContract();
  const tx = await contract.buyTicket(eventId, tokenURI, { 
    value: ethers.parseEther(priceInEth) 
  });
  return tx;
};

export const buyTicketsBatch = async (eventId: number, quantity: number, tokenURIs: string[], totalPriceEth: string) => {
  const contract = await getContract();
  const tx = await contract.buyTickets(eventId, quantity, tokenURIs, { 
    value: ethers.parseEther(totalPriceEth) 
  });
  return tx;
};