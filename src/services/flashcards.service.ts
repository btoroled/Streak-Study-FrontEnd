import api from './api.client'
import type { CreateFlashcardRequest, UpdateFlashcardRequest, FlashcardResponse, FlashcardDetailResponse } from '@/types/flashcard.types'

export const flashcardsService = {
  listByDeck: (deckId: number) =>
    api.get<FlashcardResponse[]>(`/flashcards/deck/${deckId}`).then(r => r.data),
  get: (id: number) =>
    api.get<FlashcardDetailResponse>(`/flashcards/${id}`).then(r => r.data),
  create: (data: CreateFlashcardRequest) =>
    api.post<FlashcardResponse>('/flashcards', data).then(r => r.data),
  update: (id: number, data: UpdateFlashcardRequest) =>
    api.put<FlashcardResponse>(`/flashcards/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/flashcards/${id}`),
}
