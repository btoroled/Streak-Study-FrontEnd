import api from './api.client'
import type { CreateDeckRequest, UpdateDeckRequest, DeckResponse } from '@/types/deck.types'

export const decksService = {
  list: () => api.get<DeckResponse[]>('/decks').then(r => r.data),
  get: (id: number) => api.get<DeckResponse>(`/decks/${id}`).then(r => r.data),
  create: (data: CreateDeckRequest) => api.post<DeckResponse>('/decks', data).then(r => r.data),
  update: (id: number, data: UpdateDeckRequest) => api.put<DeckResponse>(`/decks/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/decks/${id}`),
}
