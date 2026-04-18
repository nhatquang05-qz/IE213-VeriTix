import type { IVoucher, IVoucherHistory } from '../types/voucher.type';

/* ══════════════════════════════════════════
   Mock Vouchers
   
   Vouchers thuộc về TỪNG event (cấp 2).
   Key = eventId, value = danh sách voucher của event đó.
   ══════════════════════════════════════════ */

export const MOCK_VOUCHERS_BY_EVENT: Record<string, IVoucher[]> = {
  '1': [
    {
      _id: 'v1-1',
      eventId: '1',
      code: 'EARLY20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      maxUsage: 100,
      usedCount: 12,
      startDate: '2026-04-17T00:00:00Z',
      endDate: '2026-06-15T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2026-04-14T09:12:00Z',
      updatedAt: '2026-04-14T17:20:00Z',
    },
    {
      _id: 'v1-2',
      eventId: '1',
      code: 'VIP50',
      discountType: 'FIXED',
      discountValue: 0.01,
      maxUsage: 20,
      usedCount: 5,
      startDate: '2026-04-01T00:00:00Z',
      endDate: '2026-05-01T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2026-03-28T10:00:00Z',
      updatedAt: '2026-04-10T15:00:00Z',
    },
  ],
  '2': [],
  '3': [
    {
      _id: 'v3-1',
      eventId: '3',
      code: 'HACK10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      maxUsage: 50,
      usedCount: 50,
      startDate: '2026-02-01T00:00:00Z',
      endDate: '2026-04-30T00:00:00Z',
      status: 'EXPIRED',
      createdAt: '2026-01-30T12:00:00Z',
      updatedAt: '2026-05-01T00:00:00Z',
    },
  ],
  '4': [
    {
      _id: 'v4-1',
      eventId: '4',
      code: 'ART15',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      maxUsage: 80,
      usedCount: 3,
      startDate: '2026-04-15T00:00:00Z',
      endDate: '2026-08-01T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2026-04-12T08:30:00Z',
      updatedAt: '2026-04-14T10:00:00Z',
    },
  ],
  '5': [],
  '6': [],
};

export const MOCK_VOUCHER_HISTORY_BY_VOUCHER: Record<string, IVoucherHistory[]> = {
  'v1-1': [
    {
      _id: 'h-v1-1-1',
      voucherId: 'v1-1',
      action: 'CREATE',
      changes: {},
      updatedBy: 'organizer@veritix.io',
      updatedAt: '2026-04-14T09:12:00Z',
    },
    {
      _id: 'h-v1-1-2',
      voucherId: 'v1-1',
      action: 'UPDATE',
      changes: { status: { old: 'DISABLED', new: 'ACTIVE' } },
      updatedBy: 'organizer@veritix.io',
      updatedAt: '2026-04-14T17:20:00Z',
    },
  ],
  'v1-2': [
    {
      _id: 'h-v1-2-1',
      voucherId: 'v1-2',
      action: 'CREATE',
      changes: {},
      updatedBy: 'organizer@veritix.io',
      updatedAt: '2026-03-28T10:00:00Z',
    },
  ],
};
