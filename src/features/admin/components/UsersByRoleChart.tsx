import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { AdminStatsResponse } from '@/types/admin.types'

const ROLE_LABELS: Record<string, string> = {
  STUDENT: 'Estudiantes',
  TEACHER: 'Profesores',
  INSTITUTION_ADMIN: 'Admins de institución',
  SUPER_ADMIN: 'Super admins',
}

const COLORS = ['#7c3aed', '#f97316', '#0ea5e9', '#22c55e']

export default function UsersByRoleChart({
  usersByRole,
}: {
  usersByRole: AdminStatsResponse['usersByRole']
}) {
  const data = Object.entries(usersByRole).map(([role, count]) => ({
    name: ROLE_LABELS[role] ?? role,
    value: count ?? 0,
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={3}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#1a1a22',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value: string) => (
              <span className="text-xs text-text-secondary">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
