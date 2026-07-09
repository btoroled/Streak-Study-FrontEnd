import { AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import type { DeckResponse } from '@/types/deck.types'

interface Props {
  deck: DeckResponse
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function DeckDeleteDialog({ deck, onConfirm, onCancel, isLoading }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        <p className="text-sm text-text-secondary">
          ¿Eliminar <span className="font-semibold text-text-primary">"{deck.name}"</span>? Esta acción eliminará
          todas las flashcards del mazo y no se puede deshacer.
        </p>
      </div>

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button
          type="button"
          className="flex-1 bg-red-500 hover:bg-red-600"
          onClick={onConfirm}
          loading={isLoading}
        >
          Eliminar
        </Button>
      </div>
    </div>
  )
}
