import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import type { TeacherWeeklyTotals } from '@/types/teacher.types'

const nf = new Intl.NumberFormat('es-PE')
const pf = new Intl.NumberFormat('es-PE', { style: 'percent', maximumFractionDigits: 0 })

interface CardDef {
  label: string
  current: number
  previous: number
  format: (v: number) => string
}

function Delta({ current, previous, format }: { current: number; previous: number; format: (v: number) => string }) {
  const diff = current - previous
  if (diff === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-text-muted">
        <Minus className="w-3 h-3" /> igual que la semana pasada
      </span>
    )
  }
  const positive = diff > 0
  const Icon = positive ? ArrowUp : ArrowDown
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs ${positive ? 'text-[#22c55e]' : 'text-error'}`}>
      <Icon className="w-3 h-3" /> {positive ? '+' : ''}{format(diff)} vs semana pasada
    </span>
  )
}

export default function WeeklyComparisonCards({
  totals,
  previousWeek,
}: {
  totals: TeacherWeeklyTotals
  previousWeek: TeacherWeeklyTotals
}) {
  const cards: CardDef[] = [
    { label: 'Repasos', current: totals.reviews, previous: previousWeek.reviews, format: nf.format },
    { label: 'Alumnos activos', current: totals.activeStudents, previous: previousWeek.activeStudents, format: nf.format },
    { label: 'Precisión', current: totals.accuracy, previous: previousWeek.accuracy, format: pf.format },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {cards.map(({ label, current, previous, format }) => (
        <div key={label} className="bg-surface-card border border-surface-border rounded-xl p-4">
          <p className="text-xs text-text-secondary mb-1">{label}</p>
          <p className="text-lg font-bold text-text-primary mb-1">{format(current)}</p>
          <Delta current={current} previous={previous} format={format} />
        </div>
      ))}
    </div>
  )
}
