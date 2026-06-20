import api from './api.client'
import type { CreateFlashcardRequest, UpdateFlashcardRequest, FlashcardResponse, FlashcardDetailResponse, ReviewRating } from '@/types/flashcard.types'

export const flashcardsService = {
  listByDeck: (deckId: number) =>
    api.get<FlashcardResponse[]>(`/flashcards/deck/${deckId}`).then(r => r.data),
  /** Flashcards pendientes de repaso hoy (SM-2). */
  listDue: (deckId: number) =>
    api.get<FlashcardResponse[]>(`/flashcards/deck/${deckId}/due`).then(r => r.data),
  /** Cantidad de flashcards pendientes hoy. */
  countDue: (deckId: number) =>
    api.get<{ due: number }>(`/flashcards/deck/${deckId}/due/count`).then(r => r.data.due),
  /** Registra un repaso y reprograma la tarjeta según SM-2. */
  review: (id: number, rating: ReviewRating) =>
    api.post<FlashcardResponse>(`/flashcards/${id}/review`, { rating }).then(r => r.data),
  /** Pide al tutor IA una explicación del concepto de la flashcard. */
  explain: (id: number) =>
    api.post<{ explanation: string }>(`/flashcards/${id}/explain`).then(r => r.data.explanation),
  get: (id: number) =>
    api.get<FlashcardDetailResponse>(`/flashcards/${id}`).then(r => r.data),
  create: (data: CreateFlashcardRequest) =>
    api.post<FlashcardResponse>('/flashcards', data).then(r => r.data),
  update: (id: number, data: UpdateFlashcardRequest) =>
    api.put<FlashcardResponse>(`/flashcards/${id}`, data).then(r => r.data),
  remove: (id: number) => api.delete(`/flashcards/${id}`),
}
