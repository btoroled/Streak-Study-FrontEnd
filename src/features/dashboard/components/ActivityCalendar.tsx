import SectionCard from '@/shared/components/layout/SectionCard'
import { useDashboard } from '../hooks/useDashboard'

export default function ActivityCalendar() {
  const { currentStreak } = useDashboard()
  const days = Array.from({ length: 30 }, (_, i) => (29 - i) < currentStreak)
  return (
    <SectionCard title="Actividad reciente">
      <div className="flex flex-wrap gap-1">
        {days.map((active, i) => (
          <div key={i} title={active ? 'Activo' : 'Inactivo'}
            className={`w-4 h-4 rounded-sm ${active ? 'bg-[#22c55e]' : 'bg-surface-overlay'}`} />
        ))}
      </div>
      <p className="text-xs text-text-muted mt-2">
        Últimos 30 días · Racha actual: {currentStreak} {currentStreak === 1 ? 'día' : 'días'}
      </p>
    </SectionCard>
  )
}
