import { Sparkles } from 'lucide-react'

export default function WeeklyReportSummary({ summary }: { summary: string | null }) {
  if (!summary) {
    return (
      <div className="bg-surface-card border border-surface-border rounded-xl p-4">
        <p className="text-sm text-text-muted">Resumen no disponible por ahora.</p>
      </div>
    )
  }

  return (
    <div className="bg-brand-purple/10 border border-brand-purple/30 rounded-xl p-4 flex gap-3">
      <Sparkles className="w-4 h-4 text-brand-purple-light shrink-0 mt-0.5" />
      <p className="text-sm text-text-primary leading-relaxed">{summary}</p>
    </div>
  )
}
