import { motion } from 'framer-motion'
import SectionCard from '@/shared/components/layout/SectionCard'
import { LevelAvatar } from '@/shared/components/gamification/LevelAvatar'
import { useDashboard } from '../hooks/useDashboard'

export default function XpLevelCard() {
  const { xp, levelInfo, isLoading } = useDashboard()
  if (isLoading) return (
    <SectionCard>
      <div className="animate-pulse space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-32 bg-surface-border rounded" />
          <div className="h-4 w-20 bg-surface-border rounded" />
        </div>
        <div className="h-2 bg-surface-border rounded-full" />
        <div className="h-3 w-24 bg-surface-border rounded" />
      </div>
    </SectionCard>
  )
  const pct = Math.round(levelInfo.progress * 100)
  return (
    <SectionCard title="Progreso de nivel">
      <div className="flex items-center gap-3 mb-3">
        <LevelAvatar level={levelInfo.level} size={44} showBadge />
        <div>
          <p className="text-sm font-semibold text-text-primary">{levelInfo.name}</p>
          <p className="text-xs text-text-secondary">
            {levelInfo.xpToNext > 0 ? `${levelInfo.xpToNext} XP para el siguiente nivel` : 'Nivel máximo alcanzado 🏆'}
          </p>
        </div>
      </div>
      <div className="h-2 rounded-full bg-surface-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[#f97316] to-[#7c3aed] rounded-full"
        />
      </div>
      <p className="text-xs text-text-muted mt-1">{xp} XP total</p>
    </SectionCard>
  )
}
