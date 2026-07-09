import { motion } from 'framer-motion'
import { Users, BookOpenCheck, Target, GraduationCap } from 'lucide-react'
import type { TeacherCourseMetrics } from '@/types/teacher.types'

const nf = new Intl.NumberFormat('es-PE')
const pf = new Intl.NumberFormat('es-PE', { style: 'percent', maximumFractionDigits: 0 })

interface KpiDef {
  key: keyof Pick<TeacherCourseMetrics, 'activeStudents7d' | 'cardsStudied7d' | 'avgAccuracy7d' | 'studentsCount'>
  label: string
  icon: typeof Users
  accent: string
  format: (v: number) => string
}

const KPIS: KpiDef[] = [
  { key: 'activeStudents7d', label: 'Alumnos activos (7 días)', icon: Users, accent: 'from-brand-purple to-brand-purple-light', format: nf.format },
  { key: 'cardsStudied7d', label: 'Tarjetas estudiadas', icon: BookOpenCheck, accent: 'from-brand-orange to-brand-orange-light', format: nf.format },
  { key: 'avgAccuracy7d', label: 'Precisión promedio', icon: Target, accent: 'from-[#0ea5e9] to-[#38bdf8]', format: pf.format },
  { key: 'studentsCount', label: 'Alumnos inscritos', icon: GraduationCap, accent: 'from-[#eab308] to-brand-yellow', format: nf.format },
]

export default function TeacherKpiGrid({ metrics }: { metrics: TeacherCourseMetrics }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {KPIS.map(({ key, label, icon: Icon, accent, format }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
          className="bg-surface-card border border-surface-border rounded-xl p-4 flex items-center gap-3 overflow-hidden"
        >
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${accent} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-text-primary leading-tight">{format(metrics[key])}</p>
            <p className="text-xs text-text-secondary truncate">{label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
