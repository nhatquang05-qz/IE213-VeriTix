import axiosClient from '../utils/axiosClient';
import type { Event } from '../types/event.type';

export const eventService = {
  getAllEvents: async (): Promise<Event[]> => {
    const response = await axiosClient.get('/events');
    return response.data;
  },

  getEventById: async (id: string): Promise<Event> => {
    const response = await axiosClient.get(`/events/${id}`);
    return response.data;
  }
};