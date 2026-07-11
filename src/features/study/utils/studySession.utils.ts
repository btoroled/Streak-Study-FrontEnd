import type { FlashcardResponse, ReviewRating } from '@/types/flashcard.types'

export type { ReviewRating }

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function formatDuration(startMs: number): number {
  return Math.max(1, Math.ceil((Date.now() - startMs) / 60000))
}

export interface SessionCard {
  card: FlashcardResponse
  rating: ReviewRating | null
}

const DIACRITICS_PATTERN = new RegExp('[\\u0300-\\u036f]', 'g')

/** lowercase + sin acentos + trim, para comparar respuestas de forma tolerante (Issue W3.1). */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_PATTERN, '')
    .trim()
}

/** Match exacto tras normalizar — la respuesta libre no siempre es comparable literalmente (Issue W3.1). */
export function isAnswerMatch(userAnswer: string, correctAnswer: string): boolean {
  const normalizedUser = normalizeText(userAnswer)
  return normalizedUser.length > 0 && normalizedUser === normalizeText(correctAnswer)
}
