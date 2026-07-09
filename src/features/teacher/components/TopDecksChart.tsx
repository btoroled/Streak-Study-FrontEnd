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
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2b38" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fill: '#9896a8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: '#9896a8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#ffffff08' }}
            contentStyle={{ background: '#1e1f2a', border: '1px solid #2a2b38', borderRadius: 8, color: '#fff' }}
            labelStyle={{ color: '#9896a8' }}
          />
          <Bar dataKey="reviews" fill="#f97316" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
