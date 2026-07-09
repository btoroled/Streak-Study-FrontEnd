import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { TeacherWeeklyActivityPoint } from '@/types/teacher.types'

export default function WeeklyActivityChart({ data }: { data: TeacherWeeklyActivityPoint[] }) {
  const chartData = data.map((p) => ({
    label: new Date(p.date).toLocaleDateString('es', { weekday: 'short', day: 'numeric' }),
    reviews: p.reviews,
  }))

  if (chartData.length === 0) {
    return <p className="text-sm text-text-muted py-8 text-center">Sin actividad esta semana.</p>
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2b38" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#9896a8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: '#9896a8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: '#ffffff08' }}
            contentStyle={{ background: '#1e1f2a', border: '1px solid #2a2b38', borderRadius: 8, color: '#fff' }}
            labelStyle={{ color: '#9896a8' }}
          />
          <Bar dataKey="reviews" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
