import { Mic } from 'lucide-react'
import type { ReviewRating } from '../utils/studySession.utils'
import { useVoiceRating } from '../hooks/useVoiceRating'

interface Props {
  onRate: (rating: ReviewRating) => void
  disabled?: boolean
  /** Resalta esta opción como sugerida (ej. EASY tras un match exacto en modo escrito, Issue W3.1). */
  suggestedRating?: ReviewRating
}

const OPTIONS: { value: ReviewRating; label: string; hint: string; cls: string }[] = [
  { value: 'AGAIN', label: 'Otra vez', hint: '<1 día', cls: 'border-red-500/40 text-red-400 hover:bg-red-500/15' },
  { value: 'HARD',  label: 'Difícil',  hint: 'pronto', cls: 'border-orange-500/40 text-orange-400 hover:bg-orange-500/15' },
  { value: 'GOOD',  label: 'Bien',     hint: 'normal', cls: 'border-sky-500/40 text-sky-400 hover:bg-sky-500/15' },
  { value: 'EASY',  label: 'Fácil',    hint: 'más tarde', cls: 'border-green-500/40 text-green-400 hover:bg-green-500/15' },
]

export default function DifficultyRating({ onRate, disabled, suggestedRating }: Props) {
  const { start, isListening, isSupported } = useVoiceRating(onRate)

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-text-muted">¿Qué tan bien la recordaste?</p>
      <div className="grid grid-cols-4 gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            disabled={disabled}
            onClick={() => onRate(opt.value)}
            className={`relative flex flex-col items-center gap-0.5 py-2.5 rounded-xl text-sm font-medium border transition-colors disabled:opacity-50 ${opt.cls} ${
              suggestedRating === opt.value ? 'ring-2 ring-offset-2 ring-offset-surface-base ring-current' : ''
            }`}
          >
            {suggestedRating === opt.value && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-current text-[9px] font-semibold text-surface-base">
                Sugerido
              </span>
            )}
            <span>{opt.label}</span>
            <span className="text-[10px] opacity-60">{opt.hint}</span>
          </button>
        ))}
      </div>

      {isSupported && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            disabled={disabled || isListening}
            onClick={start}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors disabled:opacity-50 ${
              isListening
                ? 'border-brand-purple/60 text-brand-purple animate-pulse'
                : 'border-surface-border text-text-secondary hover:border-text-muted hover:text-text-primary'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            {isListening ? 'Escuchando…' : 'Responder por voz'}
          </button>
        </div>
      )}
    </div>
  )
}
