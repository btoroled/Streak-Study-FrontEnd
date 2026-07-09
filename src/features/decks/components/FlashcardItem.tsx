import { Pencil, Trash2 } from 'lucide-react'
import type { FlashcardResponse } from '@/types/flashcard.types'

const DIFF_STYLE: Record<string, { label: string; cls: string }> = {
  EASY:   { label: 'Fácil',   cls: 'text-green-400 bg-green-400/10' },
  MEDIUM: { label: 'Medio',   cls: 'text-yellow-400 bg-yellow-400/10' },
  HARD:   { label: 'Difícil', cls: 'text-red-400 bg-red-400/10' },
}

interface Props {
  card: FlashcardResponse
  onEdit: (card: FlashcardResponse) => void
  onDelete: (card: FlashcardResponse) => void
}

export default function FlashcardItem({ card, onEdit, onDelete }: Props) {
  const diff = DIFF_STYLE[card.difficulty] ?? DIFF_STYLE.MEDIUM

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Pregunta</span>
            <p className="text-sm text-text-primary mt-0.5">{card.question}</p>
          </div>
          <div>
            <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Respuesta</span>
            <p className="text-sm text-text-secondary mt-0.5">{card.answer}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            onClick={() => onEdit(card)}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-surface-hover transition-colors"
            onClick={() => onDelete(card)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${diff.cls}`}>
        {diff.label}
      </span>
    </div>
  )
}
