import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full px-4 py-3 rounded-lg text-sm',
        'bg-surface-overlay border text-text-primary placeholder-text-muted',
        'focus:outline-none focus:ring-2 transition-colors',
        error
          ? 'border-[#ef4444] focus:ring-[#ef4444]/30'
          : 'border-surface-border focus:border-[#7c3aed] focus:ring-[#7c3aed]/30',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
