import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { isAnswerMatch } from '../utils/studySession.utils'
import type { FlashcardResponse } from '@/types/flashcard.types'

interface Props {
  card: FlashcardResponse
  onChecked: (isMatch: boolean) => void
}

export default function WrittenAnswerCard({ card, onChecked }: Props) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [isMatch, setIsMatch] = useState(false)

  // Nueva carta: limpiar el input y el resultado de la anterior.
  useEffect(() => {
    setValue('')
    setChecked(false)
    setIsMatch(false)
  }, [card.id])

  const handleCheck = () => {
    if (!value.trim()) return
    const match = isAnswerMatch(value, card.answer)
    setIsMatch(match)
    setChecked(true)
    onChecked(match)
  }

  return (
    <div className="w-full min-h-52 bg-surface-card border border-surface-border rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-5">
      <div>
        <span className="text-xs font-medium text-text-muted uppercase tracking-widest mb-4 block">Pregunta</span>
        <p className="text-lg font-semibold text-text-primary leading-relaxed">{card.question}</p>
      </div>

      {!checked ? (
        <form
          className="w-full flex gap-2"
          onSubmit={(e) => { e.preventDefault(); handleCheck() }}
        >
          <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Escribí tu respuesta…"
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!value.trim()}>
            Comprobar
          </Button>
        </form>
      ) : (
        <div className="w-full space-y-2">
          <div
            className={`flex items-center justify-center gap-1.5 text-sm font-medium ${
              isMatch ? 'text-success' : 'text-error'
            }`}
          >
            {isMatch ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {isMatch ? '¡Correcto!' : 'No coincide exactamente'}
          </div>
          {!isMatch && (
            <p className="text-xs text-text-muted">
              Tu respuesta: <span className="text-text-secondary">{value}</span>
            </p>
          )}
          <div className="pt-2 border-t border-surface-border">
            <span className="text-xs font-medium text-text-muted uppercase tracking-widest">Respuesta correcta</span>
            <p className="text-text-primary mt-1">{card.answer}</p>
          </div>
        </div>
      )}
    </div>
  )
}
