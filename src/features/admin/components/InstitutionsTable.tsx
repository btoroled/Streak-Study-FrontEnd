import { motion } from 'framer-motion'
import type { InstitutionStatsRow } from '@/types/admin.types'

const nf = new Intl.NumberFormat('es-PE')

// Ranking de instituciones por usuarios, con barra proporcional al máximo.
export default function InstitutionsTable({ rows }: { rows: InstitutionStatsRow[] }) {
  const sorted = [...rows].sort((a, b) => b.users - a.users)
  const maxUsers = Math.max(1, ...sorted.map((r) => r.users))

  if (sorted.length === 0) {
    return <p className="text-sm text-text-muted py-4">Aún no hay instituciones registradas.</p>
  }

  return (
    <div className="space-y-3">
      {sorted.map((row, i) => (
        <div key={row.institutionId} className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-text-primary font-medium truncate">
              <span className="text-text-muted mr-2">#{i + 1}</span>
              {row.name}
            </span>
            <span className="text-xs text-text-secondary shrink-0">
              {nf.format(row.users)} usuarios · {nf.format(row.decks)} mazos ·{' '}
              {nf.format(row.reviews)} repasos
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-border overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((row.users / maxUsers) * 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
              className="h-full bg-gradient-to-r from-[#f97316] to-[#7c3aed] rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
