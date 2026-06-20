import { useNavigate } from 'react-router-dom'
import { BookOpen, Play } from 'lucide-react'
import EmptyState from '@/shared/components/feedback/EmptyState'
import DeckDueBadge from './DeckDueBadge'
import mascotReading from '@/assets/brand/mascot-reading.png'
import ApiErrorDisplay from '@/shared/components/feedback/ApiErrorDisplay'
import { Button } from '@/shared/components/ui/button'
import { useDecks } from '@/features/decks/hooks/useDecks'

export default function DeckSelector() {
  const { data: decks = [], isLoading, error, refetch } = useDecks()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) return <ApiErrorDisplay error={error} onRetry={() => refetch()} />

  if (decks.length === 0) {
    return (
      <EmptyState
        mascot={mascotReading}
        title="Sin mazos disponibles"
        description="Crea un mazo con flashcards para poder estudiar"
        action={{ label: 'Ir a mazos', onClick: () => navigate('/decks') }}
      />
    )
  }

  return (
    <div className="space-y-3">
      {decks.map((deck) => (
        <div
          key={deck.id}
          className="flex items-center justify-between gap-3 bg-[#16171f] border border-white/8 rounded-xl px-4 py-3 hover:border-orange-500/30 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-orange-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{deck.name}</p>
              {deck.description && (
                <p className="text-xs text-white/40 truncate">{deck.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <DeckDueBadge deckId={deck.id} />
            <Button size="sm" onClick={() => navigate(`/study/${deck.id}`)}>
              <Play className="w-3.5 h-3.5 mr-1" /> Estudiar
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
