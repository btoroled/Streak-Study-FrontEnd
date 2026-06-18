import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import FlashcardFlip from '@/features/study/components/FlashcardFlip'
import DifficultyRating from '@/features/study/components/DifficultyRating'
import StudyProgressBar from '@/features/study/components/StudyProgressBar'
import StudyComplete from '@/features/study/components/StudyComplete'
import LevelUpModal from '@/shared/components/gamification/LevelUpModal'
import { useStudySession } from '@/features/study/hooks/useStudySession'

export default function StudySessionPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const id = Number(deckId)
  const navigate = useNavigate()
  const { phase, loadCards, current, currentIdx, total, flipped, flip, rate, restart, xpGained, levelUp, dismissLevelUp, isSubmitting } =
    useStudySession(id)

  useEffect(() => {
    loadCards()
  }, [loadCards])

  if (phase === 'loading') {
    return (
      <div className="max-w-lg mx-auto space-y-4 animate-pulse">
        <div className="h-4 bg-white/5 rounded-full" />
        <div className="h-52 bg-white/5 rounded-2xl" />
        <div className="flex gap-3">
          {[...Array(3)].map((_, i) => <div key={i} className="flex-1 h-10 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="max-w-lg mx-auto text-center space-y-4 py-16">
        <p className="text-white/60">Este mazo no tiene flashcards.</p>
        <button
          className="text-orange-400 text-sm hover:underline"
          onClick={() => navigate(`/decks/${id}`)}
        >
          Agregar flashcards →
        </button>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <div className="max-w-lg mx-auto">
        <StudyComplete total={total} xpGained={xpGained} deckId={id} onRestart={restart} />
        <LevelUpModal
          open={levelUp !== null}
          level={levelUp?.level ?? 1}
          name={levelUp?.name ?? ''}
          onClose={dismissLevelUp}
        />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <StudyProgressBar current={currentIdx} total={total} />
        </div>
      </div>

      {current && (
        <>
          <FlashcardFlip card={current.card} flipped={flipped} onFlip={flip} />

          {flipped && (
            <DifficultyRating onRate={rate} disabled={isSubmitting} />
          )}

          {!flipped && (
            <p className="text-center text-xs text-white/30">
              Toca la tarjeta para ver la respuesta
            </p>
          )}
        </>
      )}
    </div>
  )
}
