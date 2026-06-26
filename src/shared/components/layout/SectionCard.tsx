import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SectionCardProps {
  title?: string
  children: ReactNode
  className?: string
}

export default function SectionCard({ title, children, className }: SectionCardProps) {
  return (
    <div className={cn('bg-surface-card border border-surface-border rounded-xl p-4 lg:p-5', className)}>
      {title && <h3 className="text-sm font-semibold text-text-primary mb-3">{title}</h3>}
      {children}
    </div>
  )
}
