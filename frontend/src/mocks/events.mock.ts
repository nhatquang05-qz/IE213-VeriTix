import type { IEventFull, OrganizerEvent } from '../types/organizer.type';

/* ══════════════════════════════════════════
   Mock Events
   
   Dữ liệu giả lập cho development.
   Cấu trúc: mỗi mock event có đầy đủ field của IEventFull.
   Helper `toOrganizerEvent` convert sang shape card (cho MyEventsPage).
   ══════════════════════════════════════════ */

export const MOCK_EVENTS_FULL: IEventFull[] = [
  {
    _id: '1',
    blockchainId: 1001,
    organizerWallet: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    name: 'Blockchain Summit Vietnam 2026',
    description:
      'Sự kiện công nghệ blockchain lớn nhất Việt Nam năm 2026. Quy tụ hơn 50 diễn giả quốc tế, 100+ dự án Web3, và 5000+ builder. Chủ đề: "Scaling Web3 in Southeast Asia".',
    location: 'GEM Center, 8 Nguyễn Bỉnh Khiêm, Quận 1, TP. Hồ Chí Minh',
    bannerUrl: '',
    startTime: '2026-06-15T18:00:00Z',
    endTime: '2026-06-15T22:00:00Z',
    price: '0.05',
    maxSupply: 500,
    currentMinted: 342,
    maxResellPercentage: 110,
    initialCapital: 0,
    isOnChain: true,
    status: 'ACTIVE',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-04-10T14:23:00Z',
  },
  {
    _id: '2',
    blockchainId: 1002,
    organizerWallet: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    name: 'Rap Việt All-Star Concert',
    description:
      'Đêm nhạc quy tụ các rapper hàng đầu Việt Nam. Line-up: Binz, Đen Vâu, Rhymastic, Wowy, MCK, HIEUTHUHAI và nhiều nghệ sĩ khác.',
    location: 'Phú Thọ Indoor, 221 Lý Thường Kiệt, Quận 11, TP. Hồ Chí Minh',
    bannerUrl: '',
    startTime: '2026-07-20T19:00:00Z',
    endTime: '2026-07-20T23:00:00Z',
    price: '0.08',
    maxSupply: 2000,
    currentMinted: 0,
    maxResellPercentage: 115,
    initialCapital: 0,
    isOnChain: false,
    status: 'DRAFT',
    createdAt: '2026-04-05T08:30:00Z',
    updatedAt: '2026-04-05T08:30:00Z',
  },
  {
    _id: '3',
    blockchainId: 1003,
    organizerWallet: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    name: 'Vietnam Web3 Hackathon',
    description:
      'Hackathon 48 giờ dành cho developer Việt Nam. Tổng giải thưởng 50.000 USD. 3 tracks: DeFi, NFT/Gaming, Infrastructure.',
    location: 'Online (Discord + Zoom)',
    bannerUrl: '',
    startTime: '2026-05-10T08:00:00Z',
    endTime: '2026-05-12T18:00:00Z',
    price: '0.02',
    maxSupply: 150,
    currentMinted: 150,
    maxResellPercentage: 100,
    initialCapital: 0,
    isOnChain: true,
    status: 'ENDED',
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-05-13T10:00:00Z',
  },
  {
    _id: '4',
    blockchainId: 1004,
    organizerWallet: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    name: 'Triển Lãm Nghệ Thuật Số - Digital Art Vietnam',
    description:
      'Triển lãm nghệ thuật số đầu tiên tại Việt Nam sử dụng công nghệ NFT. Hơn 200 tác phẩm từ 50 nghệ sĩ trong nước và quốc tế.',
    location: 'Bảo tàng Mỹ thuật Việt Nam, 66 Nguyễn Thái Học, Ba Đình, Hà Nội',
    bannerUrl: '',
    startTime: '2026-08-01T10:00:00Z',
    endTime: '2026-08-05T20:00:00Z',
    price: '0.03',
    maxSupply: 300,
    currentMinted: 89,
    maxResellPercentage: 110,
    initialCapital: 0,
    isOnChain: true,
    status: 'ACTIVE',
    createdAt: '2026-03-20T11:00:00Z',
    updatedAt: '2026-04-11T09:15:00Z',
  },
  {
    _id: '5',
    blockchainId: 1005,
    organizerWallet: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    name: 'Stand-Up Comedy Night Saigon',
    description:
      'Đêm hài độc thoại với sự tham gia của các comedian đình đám. Phong cách tự do, nội dung 18+.',
    location: 'Saigon Outcast, 188/1 Nguyễn Văn Hưởng, Quận 2, TP. Hồ Chí Minh',
    bannerUrl: '',
    startTime: '2026-09-12T20:00:00Z',
    endTime: '2026-09-12T22:30:00Z',
    price: '0.015',
    maxSupply: 120,
    currentMinted: 45,
    maxResellPercentage: 105,
    initialCapital: 0,
    isOnChain: true,
    status: 'ACTIVE',
    createdAt: '2026-03-25T16:00:00Z',
    updatedAt: '2026-04-14T12:00:00Z',
  },
  {
    _id: '6',
    blockchainId: 1006,
    organizerWallet: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    name: 'VBA Basketball Finals 2026',
    description:
      'Trận chung kết giải bóng rổ chuyên nghiệp Việt Nam. Saigon Heat vs Hanoi Buffaloes.',
    location: 'CIS Arena, TP. Hồ Chí Minh',
    bannerUrl: '',
    startTime: '2026-04-05T18:30:00Z',
    endTime: '2026-04-05T21:00:00Z',
    price: '0.04',
    maxSupply: 1000,
    currentMinted: 780,
    maxResellPercentage: 120,
    initialCapital: 0,
    isOnChain: true,
    status: 'ENDED',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-04-06T09:00:00Z',
  },
];


const EVENT_CATEGORY_MAP: Record<string, string> = {
  '1': 'Hội nghị / Hội thảo',
  '2': 'Âm nhạc / Concert',
  '3': 'Gaming / E-sports',
  '4': 'Triển lãm',
  '5': 'Nghệ thuật',
  '6': 'Thể thao',
};

/**
 * Convert IEventFull → OrganizerEvent (shape mà MyEventsPage/card cần)
 */
export function toOrganizerEvent(full: IEventFull): OrganizerEvent {
  return {
    _id: full._id,
    blockchainId: full.blockchainId,
    name: full.name,
    bannerUrl: full.bannerUrl,
    startTime: full.startTime,
    endTime: full.endTime,
    status: full.status,
    currentMinted: full.currentMinted,
    maxSupply: full.maxSupply,
    price: full.price,
    category: EVENT_CATEGORY_MAP[full._id] || 'Khác',
    location: full.location,
    organizerWallet: full.organizerWallet || "", 
  };
}

export const MOCK_ORGANIZER_EVENTS: OrganizerEvent[] = MOCK_EVENTS_FULL.map(toOrganizerEvent);