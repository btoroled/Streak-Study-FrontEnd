import { motion } from 'framer-motion'
import {
  Users, Activity, Building2, Layers, StickyNote, RotateCcw, Sparkles,
} from 'lucide-react'
import type { AdminStatsResponse } from '@/types/admin.types'

const nf = new Intl.NumberFormat('es-PE')

interface KpiDef {
  key: keyof Omit<AdminStatsResponse, 'usersByRole'>
  label: string
  icon: typeof Users
  accent: string
}

const KPIS: KpiDef[] = [
  { key: 'totalUsers', label: 'Usuarios totales', icon: Users, accent: 'from-[#7c3aed] to-[#a78bfa]' },
  { key: 'activeUsers', label: 'Usuarios activos (30 días)', icon: Activity, accent: 'from-[#f97316] to-[#fb923c]' },
  { key: 'totalInstitutions', label: 'Instituciones', icon: Building2, accent: 'from-[#0ea5e9] to-[#38bdf8]' },
  { key: 'totalDecks', label: 'Mazos creados', icon: Layers, accent: 'from-[#22c55e] to-[#4ade80]' },
  { key: 'totalFlashcards', label: 'Flashcards', icon: StickyNote, accent: 'from-[#eab308] to-[#facc15]' },
  { key: 'totalReviews', label: 'Repasos completados', icon: RotateCcw, accent: 'from-[#ec4899] to-[#f472b6]' },
  { key: 'aiTokensUsed', label: 'Tokens de IA consumidos', icon: Sparkles, accent: 'from-[#f97316] to-[#7c3aed]' },
]

export default function KpiGrid({ stats }: { stats: AdminStatsResponse }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
      {KPIS.map(({ key, label, icon: Icon, accent }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
          className="bg-surface-card border border-surface-border rounded-xl p-4 flex items-center gap-3 overflow-hidden relative"
        >
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${accent} flex items-center justify-center shrink-0`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-text-primary leading-tight">
              {nf.format(stats[key])}
            </p>
            <p className="text-xs text-text-secondary truncate">{label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
