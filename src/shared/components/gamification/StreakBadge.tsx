import { cn } from '@/lib/cn'

interface StreakBadgeProps {
  streak: number
  size?: 'sm' | 'md' | 'lg'
}

export default function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  const color =
    streak >= 7 ? 'text-[#facc15]' :
    streak >= 3 ? 'text-[#f97316]' :
    'text-[#5e5c70]'

  const sizeClass = size === 'sm' ? 'text-xs gap-0.5' : size === 'lg' ? 'text-base gap-1' : 'text-sm gap-1'

  return (
    <span className={cn('inline-flex items-center font-semibold', sizeClass, color)}>
      🔥 {streak}
    </span>
  )
}
