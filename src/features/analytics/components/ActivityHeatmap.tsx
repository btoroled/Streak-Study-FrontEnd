import { useMemo } from 'react'
import type { ActivityPoint } from '@/types/analytics.types'

interface Props {
  data: ActivityPoint[]
  days?: number
}

// Vacío usa el token de superficie (cambia entre temas); el resto es la marca
// (naranja/violeta), que a propósito no cambia entre temas (Issue W5.1).
function colorFor(reviews: number): string {
  if (reviews === 0) return 'var(--color-surface-overlay)'
  if (reviews < 3) return '#7c3aed66'
  if (reviews < 6) return '#f9731699'
  if (reviews < 10) return '#f97316cc'
  return '#f97316'
}

/** Heatmap de actividad de los últimos N días, estilo GitHub contributions. */
export default function ActivityHeatmap({ data, days = 35 }: Props) {
  const cells = useMemo(() => {
    const byDate = new Map(data.map((d) => [d.date, d.reviews]))
    const today = new Date()
    const result: { date: string; reviews: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const iso = d.toISOString().slice(0, 10)
      result.push({ date: iso, reviews: byDate.get(iso) ?? 0 })
    }
    return result
  }, [data, days])

  return (
    <div>
      <div className="grid grid-flow-col grid-rows-7 gap-1 justify-start">
        {cells.map((c) => (
          <div
            key={c.date}
            title={`${c.date}: ${c.reviews} repaso${c.reviews !== 1 ? 's' : ''}`}
            className="w-3.5 h-3.5 rounded-sm"
            style={{ backgroundColor: colorFor(c.reviews) }}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-text-muted">
        <span>Menos</span>
        {['var(--color-surface-overlay)', '#7c3aed66', '#f9731699', '#f97316cc', '#f97316'].map((c) => (
          <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>Más</span>
      </div>
    </div>
  )
}
