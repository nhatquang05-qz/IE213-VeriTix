import { ROUTES } from './routes';
import type { IconType } from 'react-icons';
import { MdEventNote, MdAssessment, MdGroups } from 'react-icons/md';

// Cấp 1 — Sidebar chính Organizer
export const ORGANIZER_NAV_ITEMS: {
  key: string;
  label: string;
  icon: IconType;
  path: string;
}[] = [
  {
    key: 'events',
    label: 'Sự kiện của tôi',
    icon: MdEventNote,
    path: ROUTES.ORGANIZER_EVENTS,
  },
  {
    key: 'reports',
    label: 'Quản lý báo cáo',
    icon: MdAssessment,
    path: ROUTES.ORGANIZER_REPORTS,
  },
  {
    key: 'terms',
    label: 'Điều hành ban tổ chức',
    icon: MdGroups,
    path: ROUTES.ORGANIZER_TERMS,
  },
];

// Cấp 2 — Sidebar chi tiết sự kiện
export const EVENT_DETAIL_NAV = [
  {
    group: 'Báo cáo',
    items: [
      { key: 'summary', label: 'Tổng kết', path: 'summary' },
      { key: 'checkin', label: 'Check-in', path: 'checkin' },
    ],
  },
  {
    group: 'Cài đặt sự kiện',
    items: [
      { key: 'members', label: 'Thành viên', path: 'members' },
      { key: 'edit', label: 'Chỉnh sửa', path: 'edit' },
    ],
  },
  {
    group: 'Marketing',
    items: [{ key: 'vouchers', label: 'Voucher', path: 'vouchers' }],
  },
] as const;
