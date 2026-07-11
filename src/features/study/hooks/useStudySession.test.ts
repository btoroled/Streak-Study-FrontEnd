import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createElement, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useStudySession } from './useStudySession'
import { useAuthStore } from '@/store/auth.store'
import { flashcardsService } from '@/services/flashcards.service'
import { progressService } from '@/services/progress.service'

vi.mock('@/services/flashcards.service', () => ({
  flashcardsService: {
    listDue: vi.fn(),
    listByDeck: vi.fn(),
    review: vi.fn(),
  },
}))

vi.mock('@/services/progress.service', () => ({
  progressService: {
    finishReview: vi.fn(),
  },
}))

const card = (id: number) => ({
  id,
  deckId: 1,
  question: `q${id}`,
  answer: `a${id}`,
  difficulty: 'MEDIUM' as const,
  createdAt: '2026-01-01T00:00:00Z',
})

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return createElement(QueryClientProvider, { client: qc }, children)
}

describe('useStudySession — XP', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ xp: 100, currentStreak: 2 })
  })

  it('xpGained es el delta que otorga el backend, no una fórmula local', async () => {
    vi.mocked(flashcardsService.listDue).mockResolvedValue([card(1), card(2)])
    vi.mocked(flashcardsService.review).mockResolvedValue(undefined as never)
    // El backend pasa de 100 → 112 XP: el usuario ganó exactamente 12.
    vi.mocked(progressService.finishReview).mockResolvedValue({
      xp: 112,
      currentStreak: 3,
      streakFreezes: 0,
      badges: [],
    })

    const { result } = renderHook(() => useStudySession(1), { wrapper })

    await act(() => result.current.loadCards())
    await act(() => result.current.rate('GOOD'))
    await act(() => result.current.rate('GOOD'))

    await waitFor(() => expect(result.current.phase).toBe('complete'))
    expect(result.current.xpGained).toBe(12)
  })

  it('xpGained queda en 0 si el backend no confirma la sesión', async () => {
    vi.mocked(flashcardsService.listDue).mockResolvedValue([card(1)])
    vi.mocked(flashcardsService.review).mockResolvedValue(undefined as never)
    vi.mocked(progressService.finishReview).mockRejectedValue(new Error('network'))

    const { result } = renderHook(() => useStudySession(1), { wrapper })

    await act(() => result.current.loadCards())
    await act(() => result.current.rate('GOOD').catch(() => {}))

    await waitFor(() => expect(result.current.phase).toBe('complete'))
    expect(result.current.xpGained).toBe(0)
  })
})
