import type { IEvent } from "../types/event.type";
import { mockEvents } from "../data/mockEvents";

export const getEvents = async (): Promise<IEvent[]> => {
  return Promise.resolve(mockEvents);
};

export const getEventById = async (id: string): Promise<IEvent | null> => {
  const found = mockEvents.find((event) => event._id === id);
  return Promise.resolve(found ?? null);
};
