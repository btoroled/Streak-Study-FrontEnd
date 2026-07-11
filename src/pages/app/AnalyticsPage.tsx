import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Repeat, Trophy, CalendarClock, Flame } from 'lucide-react'
import SectionCard from '@/shared/components/layout/SectionCard'
import ActivityHeatmap from '@/features/analytics/components/ActivityHeatmap'
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics'

const METRICS = [
  { key: 'totalReviews', label: 'Repasos totales', icon: Repeat, color: 'var(--color-brand-orange)' },
  { key: 'masteredCards', label: 'Tarjetas dominadas', icon: Trophy, color: 'var(--color-brand-yellow)' },
  { key: 'dueToday', label: 'Para repasar hoy', icon: CalendarClock, color: 'var(--color-brand-purple-light)' },
  { key: 'currentStreak', label: 'Racha actual', icon: Flame, color: 'var(--color-warning)' },
] as const

export default function AnalyticsPage() {
  const { stats, activity, forecast } = useAnalytics()

  const forecastData = (forecast.data ?? []).map((p) => ({
    label: new Date(p.date).toLocaleDateString('es', { weekday: 'short', day: 'numeric' }),
    due: p.due,
  }))

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Analítica</h1>
        <p className="text-sm text-text-secondary mt-0.5">Tu progreso de estudio y retención</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="bg-surface-card border border-surface-border rounded-xl p-4">
            <Icon className="w-5 h-5" style={{ color }} />
            <p className="text-2xl font-black text-text-primary mt-2">
              {stats.isLoading ? '—' : (stats.data?.[key] ?? 0)}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Actividad y repasos lado a lado en desktop, apilado en mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Heatmap de actividad */}
        <SectionCard title="Actividad (últimos 35 días)">
          {activity.isLoading ? (
            <div className="h-24 bg-surface-hover rounded-lg animate-pulse" />
          ) : (
            <ActivityHeatmap data={activity.data ?? []} />
          )}
        </SectionCard>

        {/* Pronóstico de repasos */}
        <SectionCard title="Próximos repasos (14 días)">
          {forecast.isLoading ? (
            <div className="h-56 bg-surface-hover rounded-lg animate-pulse" />
          ) : forecastData.length === 0 ? (
            <p className="text-sm text-text-muted py-8 text-center">
              No hay repasos programados. ¡Estudia para llenar tu calendario!
            </p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'var(--color-surface-hover)' }}
                    contentStyle={{ background: 'var(--color-surface-overlay)', border: '1px solid var(--color-surface-border)', borderRadius: 8, color: 'var(--color-text-primary)' }}
                    labelStyle={{ color: 'var(--color-text-secondary)' }}
                  />
                  <Bar dataKey="due" fill="var(--color-brand-orange)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}
