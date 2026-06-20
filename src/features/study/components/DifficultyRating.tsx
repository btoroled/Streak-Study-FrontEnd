import type { DifficultyRating as Rating } from '../utils/studySession.utils'

interface Props {
  onRate: (rating: Rating) => void
  disabled?: boolean
}

const OPTIONS: { value: Rating; label: string; cls: string }[] = [
  { value: 'HARD',   label: 'Difícil 😓', cls: 'border-red-500/40 text-red-400 hover:bg-red-500/15' },
  { value: 'MEDIUM', label: 'Regular 😐', cls: 'border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/15' },
  { value: 'EASY',   label: 'Fácil 😊',  cls: 'border-green-500/40 text-green-400 hover:bg-green-500/15' },
]

export default function DifficultyRating({ onRate, disabled }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-white/40">¿Qué tan fácil fue?</p>
      <div className="flex gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            disabled={disabled}
            onClick={() => onRate(opt.value)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors disabled:opacity-50 ${opt.cls}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
