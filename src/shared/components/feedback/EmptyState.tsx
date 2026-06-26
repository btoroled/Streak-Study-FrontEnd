import type { ElementType } from 'react'
import { Button } from '../ui/button'

interface EmptyStateProps {
  icon?: ElementType
  /** Imagen de la mascota; si se provee, tiene prioridad sobre `icon`. */
  mascot?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export default function EmptyState({ icon: Icon, mascot, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {mascot ? (
        <div className="relative mb-4">
          <div
            className="absolute inset-0 m-auto w-24 h-24 rounded-full blur-2xl opacity-25"
            style={{ background: 'radial-gradient(circle, #f97316 0%, #7c3aed 70%, transparent 100%)' }}
          />
          <img
            src={mascot}
            alt=""
            className="relative w-28 h-28 object-contain drop-shadow-xl animate-[float_4s_ease-in-out_infinite]"
          />
        </div>
      ) : Icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-overlay border border-surface-border flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-text-muted" />
        </div>
      )}
      <p className="text-text-primary font-semibold text-base">{title}</p>
      {description && <p className="text-sm text-text-secondary mt-1 max-w-sm">{description}</p>}
      {action && (
        <Button onClick={action.onClick} size="md" className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  )
}
