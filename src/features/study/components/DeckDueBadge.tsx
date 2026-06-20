import { useQuery } from '@tanstack/react-query'
import { flashcardsService } from '@/services/flashcards.service'
import { QK } from '@/lib/query-keys'

interface Props {
  deckId: number
}

/** Muestra cuántas flashcards del mazo están pendientes de repaso hoy (SM-2). */
export default function DeckDueBadge({ deckId }: Props) {
  const { data: due, isLoading } = useQuery({
    queryKey: QK.deckDue(deckId),
    queryFn: () => flashcardsService.countDue(deckId),
    staleTime: 60_000,
  })

  if (isLoading) {
    return <span className="h-5 w-16 rounded-full bg-white/5 animate-pulse" />
  }

  if (!due || due === 0) {
    return (
      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">
        Al día
      </span>
    )
  }

  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-medium">
      {due} para hoy
    </span>
  )
}
