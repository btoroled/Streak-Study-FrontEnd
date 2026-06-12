import { motion } from 'framer-motion'
import { getUserLevel } from '@/lib/xp.utils'
import { cn } from '@/lib/cn'

interface XpBarProps {
  xp: number
  showLevel?: boolean
  compact?: boolean
  className?: string
}

export default function XpBar({ xp, showLevel = true, compact = false, className }: XpBarProps) {
  const level = getUserLevel(xp)
  const pct = Math.round(level.progress * 100)

  return (
    <div className={cn('space-y-1', className)}>
      {showLevel && !compact && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#a78bfa] font-medium">Nivel {level.level} — {level.name}</span>
          <span className="text-[#5e5c70]">{level.xpToNext > 0 ? `${level.xpToNext} XP para siguiente` : 'Nivel máximo'}</span>
        </div>
      )}
      <div className={cn('rounded-full bg-[#2a2b38] overflow-hidden', compact ? 'h-1' : 'h-2')}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[#f97316] to-[#7c3aed] rounded-full"
        />
      </div>
      {!compact && (
        <p className="text-xs text-[#5e5c70]">{xp} XP total</p>
      )}
    </div>
  )
}
