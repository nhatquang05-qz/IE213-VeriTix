import axiosClient from '../utils/axiosClient';
import type { Event } from '../types/event.type';

export const eventService = {
  // Lấy tất cả sự kiện từ Database
  getAllEvents: async (): Promise<Event[]> => {
    const response = await axiosClient.get('/api/events');
    return response.data;
  },

  // Lấy chi tiết một sự kiện
  getEventById: async (id: string): Promise<Event> => {
    const response = await axiosClient.get(`/api/events/${id}`);
    return response.data;
  }
};