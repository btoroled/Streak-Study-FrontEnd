import { cn } from '@/lib/cn'

interface StreakBadgeProps {
  streak: number
  size?: 'sm' | 'md' | 'lg'
  /** Anima la llama mientras la racha está activa. */
  animated?: boolean
}

export default function StreakBadge({ streak, size = 'md', animated = true }: StreakBadgeProps) {
  const color =
    streak >= 7 ? 'text-[#facc15]' :
    streak >= 3 ? 'text-[#f97316]' :
    'text-[#5e5c70]'

  const sizeClass = size === 'sm' ? 'text-xs gap-0.5' : size === 'lg' ? 'text-base gap-1' : 'text-sm gap-1'

  return (
    <span className={cn('inline-flex items-center font-semibold', sizeClass, color)}>
      <span
        className={cn('inline-block', animated && streak >= 1 && 'animate-[flame-flicker_1.1s_ease-in-out_infinite]')}
      >
        🔥
      </span>
      {streak}
    </span>
  )
}
