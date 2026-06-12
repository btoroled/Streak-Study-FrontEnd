import type { ReactNode, ElementType } from 'react'
import { Button } from '../ui/button'

interface EmptyStateProps {
  icon?: ElementType
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export default function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#1e1f2a] border border-[#2a2b38] flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-[#5e5c70]" />
        </div>
      )}
      <p className="text-[#f1f0f5] font-semibold text-base">{title}</p>
      {description && <p className="text-sm text-[#9896a8] mt-1 max-w-sm">{description}</p>}
      {action && (
        <Button onClick={action.onClick} size="md" className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  )
}
