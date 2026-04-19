// Tập trung tất cả route paths — tránh hardcode string rải rác
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:id',
  RESELL: '/resell/:ticketId',

  // User
  USER_PROFILE: '/user/profile',
  USER_TICKETS: '/user/my-tickets',

  // Organizer — Cấp 1 (chỉ 3 mục: Sự kiện của tôi, Báo cáo, Điều khoản)
  ORGANIZER: '/organizer',
  ORGANIZER_EVENTS: '/organizer/events',
  ORGANIZER_CREATE_EVENT: '/organizer/events/create',
  ORGANIZER_REPORTS: '/organizer/reports',
  ORGANIZER_TERMS: '/organizer/terms',

  // Organizer — Cấp 2 (Event Detail — quản lý chi tiết 1 sự kiện)
  ORGANIZER_EVENT_DETAIL: '/organizer/events/:eventId',
  ORGANIZER_EVENT_SUMMARY: '/organizer/events/:eventId/summary',
  ORGANIZER_EVENT_CHECKIN: '/organizer/events/:eventId/checkin',
  ORGANIZER_EVENT_MEMBERS: '/organizer/events/:eventId/members',
  ORGANIZER_EVENT_EDIT: '/organizer/events/:eventId/edit',
  ORGANIZER_EVENT_VOUCHERS: '/organizer/events/:eventId/vouchers',
  ORGANIZER_EVENT_VOUCHER_CREATE: '/organizer/events/:eventId/vouchers/create',
} as const;
