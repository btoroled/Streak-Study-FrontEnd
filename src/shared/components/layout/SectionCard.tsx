import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SectionCardProps {
  title?: string
  children: ReactNode
  className?: string
}

export default function SectionCard({ title, children, className }: SectionCardProps) {
  return (
    <div className={cn('bg-[#16171f] border border-[#2a2b38] rounded-xl p-4 lg:p-5', className)}>
      {title && <h3 className="text-sm font-semibold text-[#f1f0f5] mb-3">{title}</h3>}
      {children}
    </div>
  )
}
