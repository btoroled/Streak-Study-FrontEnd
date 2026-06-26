import { Zap, Flame, Snowflake, Star } from 'lucide-react'
import type { ElementType } from 'react'
import { useDashboard } from '../hooks/useDashboard'

function StatCard({ icon: Icon, label, value, color, loading }: {
  icon: ElementType; label: string; value: string | number; color: string; loading: boolean
}) {
  if (loading) return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-surface-border mb-3" />
      <div className="h-6 w-12 bg-surface-border rounded mb-1" />
      <div className="h-3 w-16 bg-surface-border rounded" />
    </div>
  )
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary mt-0.5">{label}</p>
    </div>
  )
}

export default function StatsGrid() {
  const { xp, currentStreak, streakFreezes, levelInfo, isLoading } = useDashboard()
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard icon={Zap}       label="XP Total"        value={xp}                  color="bg-[#a78bfa]"  loading={isLoading} />
      <StatCard icon={Flame}     label="Racha actual"    value={`${currentStreak}d`} color="bg-[#f97316]"  loading={isLoading} />
      <StatCard icon={Snowflake} label="Streak Freezes"  value={streakFreezes}       color="bg-[#3b82f6]"  loading={isLoading} />
      <StatCard icon={Star}      label="Nivel"           value={levelInfo.level}     color="bg-[#facc15]"  loading={isLoading} />
    </div>
  )
}
