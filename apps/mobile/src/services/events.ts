import api from './api';
import { Event, CreateEvent, ApiResponse } from '@conexao-ativa/shared';

export const eventsService = {
  async getEvents(): Promise<Event[]> {
    const response = await api.get('/events');
    return response.data.data;
  },

  async getEventById(id: string): Promise<Event> {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
  },

  async createEvent(eventData: CreateEvent): Promise<Event> {
    const response = await api.post('/events', eventData);
    return response.data.data;
  },

  async joinEvent(eventId: string): Promise<ApiResponse> {
    const response = await api.post(`/events/${eventId}/join`);
    return response.data;
  }
};

