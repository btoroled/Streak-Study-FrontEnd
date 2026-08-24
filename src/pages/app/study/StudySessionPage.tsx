import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import FlashcardFlip from '@/features/study/components/FlashcardFlip'
import WrittenAnswerCard from '@/features/study/components/WrittenAnswerCard'
import DifficultyRating from '@/features/study/components/DifficultyRating'
import ExplainButton from '@/features/study/components/ExplainButton'
import StudyProgressBar from '@/features/study/components/StudyProgressBar'
import StudyComplete from '@/features/study/components/StudyComplete'
import LevelUpModal from '@/shared/components/gamification/LevelUpModal'
import { useStudySession } from '@/features/study/hooks/useStudySession'
import mascotCelebrate from '@/assets/brand/mascot-celebrate.png'

type StudyMode = 'flip' | 'written'
type WrittenResult = { cardId: number; isMatch: boolean }

export default function StudySessionPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const id = Number(deckId)
  const navigate = useNavigate()
  const { phase, loadCards, current, currentIdx, total, flipped, flip, rate, restart, xpGained, levelUp, dismissLevelUp, streakExtended, isSubmitting } =
    useStudySession(id)

  const [mode, setMode] = useState<StudyMode>('flip')
  const [writtenResult, setWrittenResult] = useState<WrittenResult | null>(null)

  useEffect(() => {
    loadCards()
  }, [loadCards])

  const currentWrittenResult = writtenResult?.cardId === current?.card.id
    ? writtenResult
    : null
  const showRating = mode === 'flip' ? flipped : currentWrittenResult !== null

  if (phase === 'loading') {
    return (
      <div className="max-w-lg mx-auto space-y-4 animate-pulse">
        <div className="h-4 bg-surface-hover rounded-full" />
        <div className="h-52 bg-surface-hover rounded-2xl" />
        <div className="flex gap-3">
          {[...Array(3)].map((_, i) => <div key={i} className="flex-1 h-10 bg-surface-hover rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="max-w-lg mx-auto text-center space-y-4 py-16">
        <p className="text-text-secondary">Este mazo no tiene flashcards.</p>
        <button
          className="text-orange-400 text-sm hover:underline"
          onClick={() => navigate(`/decks/${id}`)}
        >
          Agregar flashcards →
        </button>
      </div>
    )
  }

  if (phase === 'empty') {
    return (
      <div className="max-w-lg mx-auto text-center space-y-4 py-16">
        <img
          src={mascotCelebrate}
          alt=""
          className="w-28 h-28 object-contain mx-auto drop-shadow-xl animate-[float_4s_ease-in-out_infinite]"
        />
        <h2 className="text-xl font-bold text-text-primary">¡Todo al día! 🎉</h2>
        <p className="text-text-secondary text-sm">No tienes tarjetas para repasar hoy en este mazo. Vuelve mañana para mantener tu racha.</p>
        <button
          className="text-orange-400 text-sm hover:underline"
          onClick={() => navigate('/study')}
        >
          Estudiar otro mazo →
        </button>
      </div>
    )
  }

  if (phase === 'complete') {
    return (
      <div className="max-w-lg mx-auto">
        <StudyComplete total={total} xpGained={xpGained} deckId={id} streakExtended={streakExtended} onRestart={restart} />
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
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <StudyProgressBar current={currentIdx} total={total} />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex p-0.5 rounded-lg bg-surface-overlay border border-surface-border text-xs">
          {(['flip', 'written'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                mode === m ? 'bg-surface-card text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {m === 'flip' ? 'Clásico' : 'Escrito'}
            </button>
          ))}
        </div>
      </div>

      {current && (
        <>
          {mode === 'flip' ? (
            <FlashcardFlip card={current.card} flipped={flipped} onFlip={flip} />
          ) : (
            <WrittenAnswerCard
              key={current.card.id}
              card={current.card}
              onChecked={(isMatch) => setWrittenResult({ cardId: current.card.id, isMatch })}
            />
          )}

          {showRating && (
            <>
              <DifficultyRating
                onRate={rate}
                disabled={isSubmitting}
                suggestedRating={mode === 'written' && currentWrittenResult?.isMatch ? 'EASY' : undefined}
              />
              <ExplainButton flashcardId={current.card.id} />
            </>
          )}

          {mode === 'flip' && !flipped && (
            <p className="text-center text-xs text-text-muted">
              Toca la tarjeta para ver la respuesta
            </p>
          )}
        </>
      )}
    </div>
  )
}
