import api from './api';
import type {
  IEventFull,
  OrganizerDashboardResponse,
  UpdateEventPayload,
  UpdateEventResponse,
} from '../types/organizer.type';
import type { OrganizerEvent } from '../components/organizer/OrganizerEventList';

export async function getOrganizerEvents(): Promise<OrganizerEvent[]> {
  try {
    const { data } = await api.get('/events/my-events');
    
    return data.map((e: any) => ({
      _id: e._id,
      blockchainId: e.blockchainId,
      name: e.name,
      bannerUrl: e.bannerUrl,
      startTime: e.startTime,
      endTime: e.endTime,
      status: e.status,
      currentMinted: e.currentMinted || e.sold || 0,
      maxSupply: e.maxSupply,
      price: e.price,
      category: e.category || 'Khác',
      location: e.location || 'Chưa cập nhật',
      sold: e.sold || e.currentMinted || 0,
      revenueETH: e.revenueETH || "0"
    }));
  } catch (error) {
    console.error('[organizer-event.service] API failed:', error);
    throw error;
  }
}

export async function getEventById(id: string): Promise<IEventFull | null> {
  try {
    const { data } = await api.get<IEventFull>(`/events/${id}`);
    return data;
  } catch (error) {
    console.error('[organizer-event.service] getEventById failed:', error);
    return null;
  }
}

export async function updateEvent(
  blockchainId: number,
  payload: UpdateEventPayload
): Promise<UpdateEventResponse> {
  const { data } = await api.put<UpdateEventResponse>(`/events/${blockchainId}`, payload);
  return data;
}

export async function getOrganizerDashboard(): Promise<OrganizerDashboardResponse> {
  const { data } = await api.get<OrganizerDashboardResponse>('/events/organizer/dashboard');
  return data;
}