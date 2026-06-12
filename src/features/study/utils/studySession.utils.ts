import type { FlashcardResponse } from '@/types/flashcard.types'

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function computeXpGain(reviewedCards: number): number {
  return Math.max(5, Math.floor(reviewedCards * 2.5))
}

export function formatDuration(startMs: number): number {
  return Math.max(1, Math.ceil((Date.now() - startMs) / 60000))
}

export type DifficultyRating = 'EASY' | 'MEDIUM' | 'HARD'

export interface SessionCard {
  card: FlashcardResponse
  rating: DifficultyRating | null
}
