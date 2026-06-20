export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface CreateFlashcardRequest {
  deckId: number
  question: string
  answer: string
  difficulty?: Difficulty
}

export interface UpdateFlashcardRequest {
  question?: string
  answer?: string
}

export interface FlashcardResponse {
  id: number
  deckId: number
  question: string
  answer: string
  createdAt: string
  difficulty: Difficulty
  nextReviewAt?: string | null
}

export type FlashcardDetailResponse = FlashcardResponse

/** Calificación de repaso (alimenta el algoritmo SM-2 en el backend). */
export type ReviewRating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY'
