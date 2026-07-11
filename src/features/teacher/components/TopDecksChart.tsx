import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { TeacherTopDeck } from '@/types/teacher.types'

export default function TopDecksChart({ topDecks }: { topDecks: TeacherTopDeck[] }) {
  if (topDecks.length === 0) {
    return <p className="text-sm text-text-muted py-8 text-center">Sin repasos esta semana.</p>
  }

  const chartData = topDecks.map((d) => ({ name: d.name, reviews: d.reviews7d }))
  const height = Math.max(160, chartData.length * 44)

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-border)" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'var(--color-surface-hover)' }}
            contentStyle={{ background: 'var(--color-surface-overlay)', border: '1px solid var(--color-surface-border)', borderRadius: 8, color: 'var(--color-text-primary)' }}
            labelStyle={{ color: 'var(--color-text-secondary)' }}
          />
          <Bar dataKey="reviews" fill="var(--color-brand-orange)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
