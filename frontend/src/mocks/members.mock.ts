import type { IOrganizerMember } from '../types/organizer.type';

/* ══════════════════════════════════════════
   Mock Members
   
   Members thuộc về TỪNG event (cấp 2).
   Key = eventId, value = danh sách member của event đó.
   ══════════════════════════════════════════ */

export const MOCK_MEMBERS_BY_EVENT: Record<string, IOrganizerMember[]> = {
  '1': [
    {
      _id: 'm1-1',
      userId: 'u1',
      walletAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      name: 'Nguyễn Văn Tổ Chức',
      role: 'owner',
      addedAt: '2026-03-01T10:00:00Z',
    },
    {
      _id: 'm1-2',
      userId: 'u2',
      walletAddress: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
      name: 'Trần Thị Quản Trị',
      role: 'admin',
      addedAt: '2026-03-05T14:20:00Z',
    },
    {
      _id: 'm1-3',
      userId: 'u3',
      walletAddress: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
      name: 'Lê Văn Nhân Viên',
      role: 'staff',
      addedAt: '2026-03-10T09:00:00Z',
    },
  ],
  '2': [
    {
      _id: 'm2-1',
      userId: 'u1',
      walletAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      name: 'Nguyễn Văn Tổ Chức',
      role: 'owner',
      addedAt: '2026-04-05T08:30:00Z',
    },
  ],
  '3': [
    {
      _id: 'm3-1',
      userId: 'u1',
      walletAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      name: 'Nguyễn Văn Tổ Chức',
      role: 'owner',
      addedAt: '2026-02-01T09:00:00Z',
    },
    {
      _id: 'm3-2',
      userId: 'u4',
      walletAddress: '0x4d5e6f7890abcdef1234567890abcdef12345678',
      name: 'Phạm Thị Dev',
      role: 'admin',
      addedAt: '2026-02-05T10:00:00Z',
    },
  ],
  '4': [
    {
      _id: 'm4-1',
      userId: 'u1',
      walletAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      name: 'Nguyễn Văn Tổ Chức',
      role: 'owner',
      addedAt: '2026-03-20T11:00:00Z',
    },
  ],
  '5': [
    {
      _id: 'm5-1',
      userId: 'u1',
      walletAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      name: 'Nguyễn Văn Tổ Chức',
      role: 'owner',
      addedAt: '2026-03-25T16:00:00Z',
    },
  ],
  '6': [
    {
      _id: 'm6-1',
      userId: 'u1',
      walletAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      name: 'Nguyễn Văn Tổ Chức',
      role: 'owner',
      addedAt: '2026-01-15T10:00:00Z',
    },
    {
      _id: 'm6-2',
      userId: 'u5',
      walletAddress: '0x5e6f7890abcdef1234567890abcdef1234567890',
      name: 'Hoàng Văn Điều Phối',
      role: 'admin',
      addedAt: '2026-01-20T09:00:00Z',
    },
  ],
};
