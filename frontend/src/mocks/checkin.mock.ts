import type { ICheckInRecord } from '../types/organizer.type';

/* ══════════════════════════════════════════
   Mock Check-in Records
   
   Records thuộc về TỪNG event (cấp 2).
   Key = eventId, value = danh sách record check-in.
   ══════════════════════════════════════════ */

export interface CheckInSummary {
  checkedIn: number;
  insideNow: number;
  leftVenue: number;
}

export const MOCK_CHECKIN_BY_EVENT: Record<string, ICheckInRecord[]> = {
  '1': [
    {
      ticketId: 1,
      ownerWallet: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555',
      ownerName: 'Nguyễn Văn A',
      checkedInAt: '2026-06-15T17:30:00Z',
      checkedInBy: 'staff@veritix.io',
    },
    {
      ticketId: 2,
      ownerWallet: '0xaaaa2222bbbb3333cccc4444dddd5555eeee6666',
      ownerName: 'Trần Thị B',
      checkedInAt: '2026-06-15T17:35:00Z',
      checkedInBy: 'staff@veritix.io',
    },
  ],
  '2': [],
  '3': [
    {
      ticketId: 101,
      ownerWallet: '0xbbbb1111cccc2222dddd3333eeee4444ffff5555',
      ownerName: 'Hackathon Dev',
      checkedInAt: '2026-05-10T08:15:00Z',
      checkedInBy: 'admin@veritix.io',
    },
  ],
  '4': [],
  '5': [],
  '6': [
    {
      ticketId: 501,
      ownerWallet: '0xcccc1111dddd2222eeee3333ffff4444aaaa5555',
      ownerName: 'Fan Bóng Rổ',
      checkedInAt: '2026-04-05T17:45:00Z',
      checkedInBy: 'staff@veritix.io',
    },
  ],
};

export const MOCK_CHECKIN_SUMMARY_BY_EVENT: Record<string, CheckInSummary> = {
  '1': { checkedIn: 2, insideNow: 2, leftVenue: 0 },
  '2': { checkedIn: 0, insideNow: 0, leftVenue: 0 },
  '3': { checkedIn: 1, insideNow: 0, leftVenue: 1 },
  '4': { checkedIn: 0, insideNow: 0, leftVenue: 0 },
  '5': { checkedIn: 0, insideNow: 0, leftVenue: 0 },
  '6': { checkedIn: 1, insideNow: 0, leftVenue: 1 },
};
