import type { ReviewRating } from '../utils/studySession.utils'

interface Props {
  onRate: (rating: ReviewRating) => void
  disabled?: boolean
}

const OPTIONS: { value: ReviewRating; label: string; hint: string; cls: string }[] = [
  { value: 'AGAIN', label: 'Otra vez', hint: '<1 día', cls: 'border-red-500/40 text-red-400 hover:bg-red-500/15' },
  { value: 'HARD',  label: 'Difícil',  hint: 'pronto', cls: 'border-orange-500/40 text-orange-400 hover:bg-orange-500/15' },
  { value: 'GOOD',  label: 'Bien',     hint: 'normal', cls: 'border-sky-500/40 text-sky-400 hover:bg-sky-500/15' },
  { value: 'EASY',  label: 'Fácil',    hint: 'más tarde', cls: 'border-green-500/40 text-green-400 hover:bg-green-500/15' },
]

export default function DifficultyRating({ onRate, disabled }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-white/40">¿Qué tan bien la recordaste?</p>
      <div className="grid grid-cols-4 gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            disabled={disabled}
            onClick={() => onRate(opt.value)}
            className={`flex flex-col items-center gap-0.5 py-2.5 rounded-xl text-sm font-medium border transition-colors disabled:opacity-50 ${opt.cls}`}
          >
            <span>{opt.label}</span>
            <span className="text-[10px] opacity-60">{opt.hint}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
