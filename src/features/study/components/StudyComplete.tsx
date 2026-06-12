import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import XpGainAnimation from './XpGainAnimation'

interface Props {
  total: number
  xpGained: number
  deckId: number
  onRestart: () => void
}

export default function StudyComplete({ total, xpGained, deckId, onRestart }: Props) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div className="text-5xl">🎉</div>
      <div>
        <h2 className="text-xl font-bold text-white">¡Sesión completada!</h2>
        <p className="text-white/50 text-sm mt-1">Repasaste {total} flashcard{total !== 1 ? 's' : ''}</p>
      </div>

      <XpGainAnimation xp={xpGained} />

      <div className="flex gap-3 w-full max-w-xs">
        <Button variant="outline" className="flex-1" onClick={() => navigate(`/decks/${deckId}`)}>
          Ver mazo
        </Button>
        <Button className="flex-1" onClick={onRestart}>
          Repetir
        </Button>
      </div>

      <button
        className="text-xs text-white/30 hover:text-white/60 transition-colors"
        onClick={() => navigate('/study')}
      >
        Estudiar otro mazo →
      </button>
    </div>
  )
}
