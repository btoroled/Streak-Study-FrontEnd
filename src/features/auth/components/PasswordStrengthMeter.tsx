import { calculatePasswordStrength, type PasswordStrength } from '../utils/passwordStrength'

interface Props {
  password: string
}

const CONFIG: Record<PasswordStrength, { label: string; barClass: string; textClass: string; bars: number }> = {
  weak:   { label: 'Débil',  barClass: 'bg-error',       textClass: 'text-error',       bars: 1 },
  medium: { label: 'Media',  barClass: 'bg-[#eab308]',   textClass: 'text-[#eab308]',   bars: 2 },
  strong: { label: 'Fuerte', barClass: 'bg-success',     textClass: 'text-success',     bars: 3 },
}

export default function PasswordStrengthMeter({ password }: Props) {
  if (!password) return null

  const strength = calculatePasswordStrength(password)
  const { label, barClass, textClass, bars } = CONFIG[strength]

  return (
    <div className="space-y-1" aria-live="polite">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= bars ? barClass : 'bg-surface-overlay'}`}
          />
        ))}
      </div>
      <p className={`text-xs ${textClass}`}>Fuerza: {label}</p>
    </div>
  )
}
