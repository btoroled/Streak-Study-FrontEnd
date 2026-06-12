import DeckCard from './DeckCard'
import EmptyState from '@/shared/components/feedback/EmptyState'
import { BookOpen } from 'lucide-react'
import type { DeckResponse } from '@/types/deck.types'

interface Props {
  decks: DeckResponse[]
  onEdit: (deck: DeckResponse) => void
  onDelete: (deck: DeckResponse) => void
  onCreateFirst?: () => void
}

export default function DeckGrid({ decks, onEdit, onDelete, onCreateFirst }: Props) {
  if (decks.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No tienes mazos aún"
        description="Crea tu primer mazo para empezar a estudiar con flashcards"
        action={onCreateFirst ? { label: 'Crear primer mazo', onClick: onCreateFirst } : undefined}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
