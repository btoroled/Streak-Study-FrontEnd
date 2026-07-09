import { AlertTriangle, PartyPopper } from 'lucide-react'
import type { TeacherWeeklyStudentRow } from '@/types/teacher.types'

const dtf = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' })

export default function AtRiskStudentsList({ students }: { students: TeacherWeeklyStudentRow[] }) {
  const atRisk = students.filter((s) => s.atRisk)

  if (atRisk.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-text-secondary py-4">
        <PartyPopper className="w-4 h-4 text-brand-yellow shrink-0" />
        Ningún alumno en riesgo esta semana.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {atRisk.map((s) => (
        <div
          key={s.userId}
          className="flex items-center gap-3 bg-error/10 border border-error/30 rounded-lg px-3 py-2"
        >
          <AlertTriangle className="w-4 h-4 text-error shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary">{s.fullName}</p>
            <p className="text-xs text-text-secondary">
              Última actividad: {s.lastActivity ? dtf.format(new Date(s.lastActivity)) : 'nunca'}
            </p>
          </div>
          <span className="text-xs text-text-muted shrink-0">{s.reviews7d} repasos</span>
        </div>
      ))}
    </div>
  )
}
