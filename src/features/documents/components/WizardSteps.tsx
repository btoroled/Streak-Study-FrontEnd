import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { WizardStep } from '../utils/wizard.utils'

const STEPS: { step: WizardStep; label: string }[] = [
  { step: 1, label: 'Subir PDF' },
  { step: 2, label: 'Revisar' },
  { step: 3, label: 'Generar' },
  { step: 4, label: 'Ver mazo' },
]

export default function WizardSteps({ current }: { current: WizardStep }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progreso del asistente">
      {STEPS.map(({ step, label }, i) => {
        const isDone = step < current
        const isCurrent = step === current
        return (
          <li key={step} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className="flex items-center gap-2 shrink-0" aria-current={isCurrent ? 'step' : undefined}>
              <span
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors',
                  isDone && 'bg-brand-purple text-white',
                  isCurrent && 'bg-brand-orange text-white',
                  !isDone && !isCurrent && 'bg-surface-overlay text-text-muted border border-surface-border',
                )}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : step}
              </span>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:inline',
                  isCurrent ? 'text-text-primary' : 'text-text-muted',
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('h-px flex-1', isDone ? 'bg-brand-purple/60' : 'bg-surface-border')} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
