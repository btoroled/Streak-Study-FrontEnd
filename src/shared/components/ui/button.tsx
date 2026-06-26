import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-[#f97316] to-[#7c3aed] text-white font-semibold hover:opacity-90 active:opacity-80',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
  outline:
    'border border-surface-border text-text-secondary hover:border-[#7c3aed] hover:text-[#a78bfa]',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'w-full py-3 px-4 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled ?? loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg transition-all',
        'focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
      )}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
