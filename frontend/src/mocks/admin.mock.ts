/* ══════════════════════════════════════════
   Mock Admin Data
   
   Dữ liệu giả lập cho Admin Dashboard.
   ══════════════════════════════════════════ */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'organizer' | 'admin';
  status: 'active' | 'suspended' | 'inactive';
  joinDate: string;
  walletAddress: string;
  totalTickets: number;
}

export interface AdminEvent {
  id: string;
  name: string;
  organizer: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'ended';
  startDate: string;
  endDate: string;
  maxTickets: number;
  soldTickets: number;
  revenue: number;
  capacity: number;
}

export interface SystemStats {
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  activeEvents: number;
  totalRevenue: number;
  totalTicketsSold: number;
  totalParticipants: number;
  platformFee: number;
}

// Mock Users
export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    role: 'organizer',
    status: 'active',
    joinDate: '2026-01-15',
    walletAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    totalTickets: 2500,
  },
  {
    id: '2',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2026-02-20',
    walletAddress: '0x2c3d4e5f6789abcdef1234567890abcdef1234ab',
    totalTickets: 15,
  },
  {
    id: '3',
    name: 'Phạm Văn C',
    email: 'phamvanc@example.com',
    role: 'organizer',
    status: 'active',
    joinDate: '2026-01-30',
    walletAddress: '0x3d4e5f678abcdef1234567890abcdef1234abcd',
    totalTickets: 1800,
  },
  {
    id: '4',
    name: 'Hoàng Thị D',
    email: 'hoangthid@example.com',
    role: 'user',
    status: 'suspended',
    joinDate: '2026-03-01',
    walletAddress: '0x4e5f6789abcdef1234567890abcdef1234abcde',
    totalTickets: 5,
  },
  {
    id: '5',
    name: 'Lê Văn E',
    email: 'levane@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2026-03-10',
    walletAddress: '0x5f6789abcdef1234567890abcdef1234abcdef1',
    totalTickets: 32,
  },
  {
    id: '6',
    name: 'Đặng Thị F',
    email: 'dangthif@example.com',
    role: 'organizer',
    status: 'inactive',
    joinDate: '2025-12-20',
    walletAddress: '0x6789abcdef1234567890abcdef1234abcdef12a',
    totalTickets: 900,
  },
  {
    id: '7',
    name: 'Bùi Văn G',
    email: 'buivang@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2026-04-05',
    walletAddress: '0x789abcdef1234567890abcdef1234abcdef12ab',
    totalTickets: 8,
  },
  {
    id: '8',
    name: 'Vương Thị H',
    email: 'vuongthih@example.com',
    role: 'organizer',
    status: 'active',
    joinDate: '2026-02-05',
    walletAddress: '0x89abcdef1234567890abcdef1234abcdef12abc',
    totalTickets: 3200,
  },
];

// Mock Events for Admin Review
export const MOCK_ADMIN_EVENTS: AdminEvent[] = [
  {
    id: '1',
    name: 'Blockchain Summit Vietnam 2026',
    organizer: 'Nguyễn Văn A',
    status: 'approved',
    startDate: '2026-06-15',
    endDate: '2026-06-15',
    maxTickets: 500,
    soldTickets: 342,
    revenue: 17.1,
    capacity: 5000,
  },
  {
    id: '2',
    name: 'Rap Việt All-Star Concert',
    organizer: 'Phạm Văn C',
    status: 'pending',
    startDate: '2026-07-20',
    endDate: '2026-07-20',
    maxTickets: 2000,
    soldTickets: 0,
    revenue: 0,
    capacity: 3000,
  },
  {
    id: '3',
    name: 'Vietnam Web3 Hackathon',
    organizer: 'Nguyễn Văn A',
    status: 'approved',
    startDate: '2026-05-10',
    endDate: '2026-05-12',
    maxTickets: 150,
    soldTickets: 150,
    revenue: 3.0,
    capacity: 200,
  },
  {
    id: '4',
    name: 'Triển Lãm Nghệ Thuật Số',
    organizer: 'Đặng Thị F',
    status: 'approved',
    startDate: '2026-08-01',
    endDate: '2026-08-05',
    maxTickets: 300,
    soldTickets: 89,
    revenue: 2.67,
    capacity: 500,
  },
  {
    id: '5',
    name: 'Stand-Up Comedy Night Saigon',
    organizer: 'Vương Thị H',
    status: 'pending',
    startDate: '2026-06-28',
    endDate: '2026-06-28',
    maxTickets: 400,
    soldTickets: 0,
    revenue: 0,
    capacity: 600,
  },
  {
    id: '6',
    name: 'Tech Conference 2026',
    organizer: 'Phạm Văn C',
    status: 'rejected',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    maxTickets: 1000,
    soldTickets: 0,
    revenue: 0,
    capacity: 2000,
  },
  {
    id: '7',
    name: 'Music Festival Summer 2026',
    organizer: 'Nguyễn Văn A',
    status: 'active',
    startDate: '2026-05-01',
    endDate: '2026-05-05',
    maxTickets: 5000,
    soldTickets: 4200,
    revenue: 210.0,
    capacity: 10000,
  },
  {
    id: '8',
    name: 'Sports Marathon Asia',
    organizer: 'Vương Thị H',
    status: 'ended',
    startDate: '2026-03-15',
    endDate: '2026-03-15',
    maxTickets: 800,
    soldTickets: 750,
    revenue: 15.0,
    capacity: 1500,
  },
];

// System Statistics
export const MOCK_SYSTEM_STATS: SystemStats = {
  totalUsers: 2547,
  totalOrganizers: 185,
  totalEvents: 342,
  activeEvents: 28,
  totalRevenue: 45230.5,
  totalTicketsSold: 12458,
  totalParticipants: 45230,
  platformFee: 2261.53,
};

// Event Statistics by Event
export const MOCK_EVENT_STATISTICS = [
  {
    eventId: '1',
    eventName: 'Blockchain Summit Vietnam 2026',
    ticketsSold: 342,
    revenue: 17.1,
    participants: 342,
    avgTicketPrice: 0.05,
    occupancyRate: 68.4,
  },
  {
    eventId: '3',
    eventName: 'Vietnam Web3 Hackathon',
    ticketsSold: 150,
    revenue: 3.0,
    participants: 150,
    avgTicketPrice: 0.02,
    occupancyRate: 100,
  },
  {
    eventId: '4',
    eventName: 'Triển Lãm Nghệ Thuật Số',
    ticketsSold: 89,
    revenue: 2.67,
    participants: 89,
    avgTicketPrice: 0.03,
    occupancyRate: 29.67,
  },
  {
    eventId: '7',
    eventName: 'Music Festival Summer 2026',
    ticketsSold: 4200,
    revenue: 210.0,
    participants: 4200,
    avgTicketPrice: 0.05,
    occupancyRate: 84,
  },
  {
    eventId: '8',
    eventName: 'Sports Marathon Asia',
    ticketsSold: 750,
    revenue: 15.0,
    participants: 750,
    avgTicketPrice: 0.02,
    occupancyRate: 93.75,
  },
];
