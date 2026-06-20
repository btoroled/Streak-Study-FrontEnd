import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Repeat, Trophy, CalendarClock, Flame } from 'lucide-react'
import SectionCard from '@/shared/components/layout/SectionCard'
import ActivityHeatmap from '@/features/analytics/components/ActivityHeatmap'
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics'

const METRICS = [
  { key: 'totalReviews', label: 'Repasos totales', icon: Repeat, color: '#f97316' },
  { key: 'masteredCards', label: 'Tarjetas dominadas', icon: Trophy, color: '#facc15' },
  { key: 'dueToday', label: 'Para repasar hoy', icon: CalendarClock, color: '#a78bfa' },
  { key: 'currentStreak', label: 'Racha actual', icon: Flame, color: '#fb7185' },
] as const

export default function AnalyticsPage() {
  const { stats, activity, forecast } = useAnalytics()

  const forecastData = (forecast.data ?? []).map((p) => ({
    label: new Date(p.date).toLocaleDateString('es', { weekday: 'short', day: 'numeric' }),
    due: p.due,
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Analítica</h1>
        <p className="text-sm text-white/50 mt-0.5">Tu progreso de estudio y retención</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="bg-[#16171f] border border-white/8 rounded-xl p-4">
            <Icon className="w-5 h-5" style={{ color }} />
            <p className="text-2xl font-black text-white mt-2">
              {stats.isLoading ? '—' : (stats.data?.[key] ?? 0)}
            </p>
            <p className="text-xs text-white/45 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Heatmap de actividad */}
      <SectionCard title="Actividad (últimos 35 días)">
        {activity.isLoading ? (
          <div className="h-24 bg-white/5 rounded-lg animate-pulse" />
        ) : (
          <ActivityHeatmap data={activity.data ?? []} />
        )}
      </SectionCard>

      {/* Pronóstico de repasos */}
      <SectionCard title="Próximos repasos (14 días)">
        {forecast.isLoading ? (
          <div className="h-56 bg-white/5 rounded-lg animate-pulse" />
        ) : forecastData.length === 0 ? (
          <p className="text-sm text-white/40 py-8 text-center">
            No hay repasos programados. ¡Estudia para llenar tu calendario!
          </p>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2b38" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#9896a8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#9896a8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#ffffff08' }}
                  contentStyle={{ background: '#1e1f2a', border: '1px solid #2a2b38', borderRadius: 8, color: '#fff' }}
                  labelStyle={{ color: '#9896a8' }}
                />
                <Bar dataKey="due" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
