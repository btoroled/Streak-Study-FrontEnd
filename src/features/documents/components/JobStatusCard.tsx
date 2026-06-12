import { CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react'
import type { AiGenerationJobResponse } from '@/types/document.types'

interface Props { job: AiGenerationJobResponse }

export default function JobStatusCard({ job }: Props) {
  return (
    <div className="bg-[#16171f] border border-white/8 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2">
        {job.status === 'COMPLETED' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
        {job.status === 'FAILED' && <XCircle className="w-4 h-4 text-red-400" />}
        {(job.status === 'PENDING' || job.status === 'RUNNING') && (
          <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
        )}
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-white">
          {job.status === 'COMPLETED' ? 'Flashcards generadas' :
           job.status === 'FAILED' ? 'Error al generar' : 'Generando flashcards…'}
        </span>
      </div>
      {job.status === 'FAILED' && job.errorMessage && (
        <p className="text-xs text-red-400 pl-6">{job.errorMessage}</p>
      )}
      {job.status === 'COMPLETED' && (
        <div className="flex gap-4 pl-6 text-xs text-white/40">
          <span>Tokens: {job.totalInputTokens + job.totalOutputTokens}</span>
          <span>Costo: ${job.estimatedCostUsd.toFixed(4)}</span>
        </div>
      )}
    </div>
  )
}
