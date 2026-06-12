import { motion } from 'framer-motion'
import SectionCard from '@/shared/components/layout/SectionCard'
import { useDashboard } from '../hooks/useDashboard'

export default function XpLevelCard() {
  const { xp, levelInfo, isLoading } = useDashboard()
  if (isLoading) return (
    <SectionCard>
      <div className="animate-pulse space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-32 bg-[#2a2b38] rounded" />
          <div className="h-4 w-20 bg-[#2a2b38] rounded" />
        </div>
        <div className="h-2 bg-[#2a2b38] rounded-full" />
        <div className="h-3 w-24 bg-[#2a2b38] rounded" />
      </div>
    </SectionCard>
  )
  const pct = Math.round(levelInfo.progress * 100)
  return (
    <SectionCard title="Progreso de nivel">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f97316] to-[#7c3aed] flex items-center justify-center shrink-0">
          <span className="text-sm font-black text-white">{levelInfo.level}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#f1f0f5]">{levelInfo.name}</p>
          <p className="text-xs text-[#9896a8]">
            {levelInfo.xpToNext > 0 ? `${levelInfo.xpToNext} XP para el siguiente nivel` : 'Nivel máximo alcanzado 🏆'}
          </p>
        </div>
      </div>
      <div className="h-2 rounded-full bg-[#2a2b38] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[#f97316] to-[#7c3aed] rounded-full"
        />
      </div>
      <p className="text-xs text-[#5e5c70] mt-1">{xp} XP total</p>
    </SectionCard>
  )
}
