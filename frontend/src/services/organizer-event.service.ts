import api, { getErrorMessage } from './api';
import { MOCK_EVENTS_FULL, MOCK_ORGANIZER_EVENTS } from '../mocks/events.mock';
import type {
  OrganizerEvent,
  IEventFull,
  OrganizerDashboardResponse,
  UpdateEventPayload,
  UpdateEventResponse,
} from '../types/organizer.type';
import type { EventStatus } from '../constants/event';

/* ══════════════════════════════════════════
   Organizer Event Service
   
   MẶC ĐỊNH: dùng mock data (USE_MOCK = true).
   Khi backend sẵn sàng, set `VITE_USE_MOCK=false` trong .env để gọi API thật.
   
   Mock data được import tập trung từ /mocks/events.mock.ts
   (tránh duplicate — trước đây service có 1 bản copy riêng).
   
   Backend endpoints (khi USE_MOCK = false):
   - GET  /api/events/organizer/dashboard  → OrganizerDashboardResponse
   - GET  /api/events/:id                  → IEventFull (param = blockchainId)
   - PUT  /api/events/:id                  → UpdateEventResponse
   ══════════════════════════════════════════ */

// ── Flag: mặc định dùng mock. Set VITE_USE_MOCK=false để gọi API thật ──
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─────────────────────────────────────────
// MAPPER: Backend IEventFull → OrganizerEvent
// ─────────────────────────────────────────

/**
 * Backend Event model không có field `category`.
 * Tạm map từ IEventFull → OrganizerEvent, gán category = 'Khác'.
 *
 * Khi backend thêm field category vào Event model → bỏ default.
 */
function mapFullEventToOrganizerEvent(event: IEventFull): OrganizerEvent {
  return {
    _id: event._id,
    blockchainId: event.blockchainId,
    name: event.name,
    bannerUrl: event.bannerUrl,
    startTime: event.startTime,
    endTime: event.endTime,
    status: event.status,
    currentMinted: event.currentMinted,
    maxSupply: event.maxSupply,
    price: event.price,
    category: (event as IEventFull & { category?: string }).category || 'Khác',
    location: event.location,
  };
}

// ─────────────────────────────────────────
// MOCK IN-MEMORY STORE (để updateEvent có tác dụng thực sự khi mock)
// ─────────────────────────────────────────

const mockStore: IEventFull[] = MOCK_EVENTS_FULL.map((e) => ({ ...e }));

// ─────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────

/**
 * Lấy danh sách events của organizer hiện tại.
 *
 * Gọi bởi: MyEventsPage
 * Return: OrganizerEvent[] — shape mà OrganizerEventCard cần
 */
export async function getOrganizerEvents(): Promise<OrganizerEvent[]> {
  if (USE_MOCK) {
    await delay(400);
    return MOCK_ORGANIZER_EVENTS;
  }

  try {
    const { data } = await api.get<OrganizerDashboardResponse>('/events/organizer/dashboard');

    // Dashboard trả OrganizerEventSummary[] (ít fields).
    // MyEventsPage cần OrganizerEvent (nhiều fields hơn).
    // → Fetch full events rồi filter theo _id có trong dashboard.
    const allEventsRes = await api.get<IEventFull[]>('/events');
    const dashboardIds = new Set(data.events.map((e) => e._id));
    const myEvents = allEventsRes.data.filter((e) => dashboardIds.has(e._id));

    return myEvents.map(mapFullEventToOrganizerEvent);
  } catch (error) {
    console.warn(
      '[organizer-event.service] API failed, falling back to mock:',
      getErrorMessage(error)
    );
    await delay(300);
    return MOCK_ORGANIZER_EVENTS;
  }
}

/**
 * Lấy chi tiết 1 event theo _id (MongoDB ObjectId).
 *
 * Gọi bởi: OrganizerEventDetailLayout (cấp 2)
 * Return: IEventFull | null
 */
export async function getEventById(id: string): Promise<IEventFull | null> {
  if (USE_MOCK) {
    await delay(200);
    const found = mockStore.find((e) => e._id === id);
    return found ? { ...found } : null;
  }

  try {
    const { data } = await api.get<IEventFull>(`/events/${id}`);
    return data;
  } catch (error) {
    console.error('[organizer-event.service] getEventById failed:', getErrorMessage(error));
    return null;
  }
}

/**
 * Cập nhật metadata của event.
 *
 * Gọi bởi: EventEditPage
 * Backend: PUT /api/events/:id (blockchainId)
 *
 * Trong mock mode: cập nhật in-memory store để refetch thấy thay đổi.
 */
export async function updateEvent(
  blockchainId: number,
  payload: UpdateEventPayload
): Promise<UpdateEventResponse> {
  if (USE_MOCK) {
    await delay(300);
    const idx = mockStore.findIndex((e) => e.blockchainId === blockchainId);
    if (idx === -1) {
      throw new Error('Không tìm thấy sự kiện để cập nhật');
    }

    // Chỉ update field nào có trong payload (giống backend)
    const updated: IEventFull = {
      ...mockStore[idx],
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.location !== undefined && { location: payload.location }),
      ...(payload.bannerUrl !== undefined && { bannerUrl: payload.bannerUrl }),
      ...(payload.startTime !== undefined && { startTime: payload.startTime }),
      ...(payload.endTime !== undefined && { endTime: payload.endTime }),
      updatedAt: new Date().toISOString(),
    };
    mockStore[idx] = updated;

    return {
      message: 'Cập nhật sự kiện thành công (mock)',
      event: { ...updated },
    };
  }

  const { data } = await api.put<UpdateEventResponse>(`/events/${blockchainId}`, payload);
  return data;
}

/**
 * Lấy dashboard stats (tổng event, tổng vé bán, doanh thu).
 *
 * Gọi bởi: ReportsPage
 * Backend: GET /api/events/organizer/dashboard
 */
export async function getOrganizerDashboard(): Promise<OrganizerDashboardResponse> {
  if (USE_MOCK) {
    await delay(300);
    return {
      summary: {
        totalEvents: mockStore.length,
        totalTicketsSold: mockStore.reduce((a, e) => a + e.currentMinted, 0),
        totalRevenueETH: mockStore
          .reduce((a, e) => a + e.currentMinted * parseFloat(e.price), 0)
          .toFixed(4),
      },
      events: mockStore.map((e) => ({
        _id: e._id,
        blockchainId: e.blockchainId,
        name: e.name,
        status: e.status as EventStatus,
        maxSupply: e.maxSupply,
        sold: e.currentMinted,
        revenueETH: (e.currentMinted * parseFloat(e.price)).toFixed(4),
        bannerUrl: e.bannerUrl,
      })),
    };
  }

  const { data } = await api.get<OrganizerDashboardResponse>('/events/organizer/dashboard');
  return data;
}
