export interface IEvent {
  _id: string;
  blockchainId: number;
  organizerWallet: string;
  name: string;
  description: string;
  location: string;
  bannerUrl: string;
  startTime: Date | string;
  endTime?: Date | string;
  price: string;
  maxSupply: number;
  currentMinted: number;
  maxResellPercentage: number;
  initialCapital: number;
  isOnChain: boolean;
  status: 'DRAFT' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
  createdAt?: string;
  updatedAt?: string;
}

// For backward compatibility with existing code
export type Event = IEvent;
