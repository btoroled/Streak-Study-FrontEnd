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
}

export type FlashcardDetailResponse = FlashcardResponse
