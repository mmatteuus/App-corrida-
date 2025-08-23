import api from './api';
import { Place, CreatePlace } from '@conexao-ativa/shared';

export const placesService = {
  async getPlaces(): Promise<Place[]> {
    const response = await api.get('/places');
    return response.data.data;
  },

  async createPlace(placeData: CreatePlace): Promise<Place> {
    const response = await api.post('/places', placeData);
    return response.data.data;
  }
};

