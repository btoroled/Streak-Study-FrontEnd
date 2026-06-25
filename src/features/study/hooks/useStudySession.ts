import { useState, useCallback, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { flashcardsService } from '@/services/flashcards.service'
import { progressService } from '@/services/progress.service'
import { useAuthStore } from '@/store/auth.store'
import { QK } from '@/lib/query-keys'
import { shuffle, computeXpGain, formatDuration, type ReviewRating, type SessionCard } from '../utils/studySession.utils'
import { getUserLevel } from '@/lib/xp.utils'
import type { FlashcardResponse } from '@/types/flashcard.types'

// 'empty' = no hay tarjetas pendientes (todo al día); 'error' = el mazo no tiene flashcards
type Phase = 'loading' | 'studying' | 'complete' | 'empty' | 'error'

export interface LevelUpInfo {
  level: number
  name: string
}

export function useStudySession(deckId: number) {
  const qc = useQueryClient()
  const setProgress = useAuthStore((s) => s.setProgress)

  const [cards, setCards] = useState<SessionCard[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [phase, setPhase] = useState<Phase>('loading')
  const [xpGained, setXpGained] = useState(0)
  const [levelUp, setLevelUp] = useState<LevelUpInfo | null>(null)
  const [streakExtended, setStreakExtended] = useState<number | null>(null)
  const startedAt = useRef(0)

  const finishMutation = useMutation({
    mutationFn: progressService.finishReview,
    onSuccess: (data) => {
      if (data) setProgress(data)
      qc.invalidateQueries({ queryKey: QK.progress })
    },
    onError: () => toast.error('No se pudo registrar la sesión'),
  })

  const loadCards = useCallback(async () => {
    setPhase('loading')
    startedAt.current = Date.now()
    setLevelUp(null)
    setStreakExtended(null)
    try {
      // Solo las tarjetas pendientes de repaso hoy (SM-2)
      const due = await flashcardsService.listDue(deckId)
      if (due.length === 0) {
        // ¿El mazo tiene tarjetas pero ya están al día, o no tiene ninguna?
        const all = await flashcardsService.listByDeck(deckId)
        setPhase(all.totalElements === 0 ? 'error' : 'empty')
        return
      }
      const ordered: SessionCard[] = shuffle(due).map((c: FlashcardResponse) => ({ card: c, rating: null }))
      setCards(ordered)
      setCurrentIdx(0)
      setFlipped(false)
      setPhase('studying')
    } catch {
      setPhase('error')
    }
  }, [deckId])

  const flip = () => setFlipped((v) => !v)

  const rate = async (rating: ReviewRating) => {
    const currentCard = cards[currentIdx]?.card
    const updated = cards.map((sc, i) =>
      i === currentIdx ? { ...sc, rating } : sc
    )
    setCards(updated)
    setFlipped(false)

    // Registrar el repaso (SM-2) en el backend. No bloquea el avance.
    if (currentCard) {
      flashcardsService.review(currentCard.id, rating).catch(() => {})
    }

    const next = currentIdx + 1
    if (next >= cards.length) {
      const reviewed = updated.length
      const duration = formatDuration(startedAt.current)
      const xp = computeXpGain(reviewed)
      setXpGained(xp)
      setPhase('complete')

      const levelBefore = getUserLevel(useAuthStore.getState().xp).level
      const streakBefore = useAuthStore.getState().currentStreak
      const data = await finishMutation.mutateAsync({ reviewedCards: reviewed, durationMinutes: duration })
      if (data) {
        const after = getUserLevel(data.xp)
        if (after.level > levelBefore) {
          setLevelUp({ level: after.level, name: after.name })
        }
        if (data.currentStreak > streakBefore) {
          setStreakExtended(data.currentStreak)
        }
      }
    } else {
      setCurrentIdx(next)
    }
  }

  // Reintentar = volver a cargar las tarjetas pendientes (ya reprogramadas por SM-2)
  const restart = () => {
    loadCards()
  }

  const dismissLevelUp = () => setLevelUp(null)

  const current = cards[currentIdx] ?? null
  const progress = cards.length > 0 ? currentIdx / cards.length : 0

  return { phase, loadCards, current, currentIdx, total: cards.length, progress, flipped, flip, rate, restart, xpGained, levelUp, dismissLevelUp, streakExtended, isSubmitting: finishMutation.isPending }
}
