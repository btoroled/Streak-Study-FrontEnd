import { CheckCircle2, XCircle, Clock, Loader2, ScanText } from 'lucide-react'
import type { DocumentStatusResponse } from '@/types/document.types'

interface Props { doc: DocumentStatusResponse }

const STATUS_INFO = {
  PENDING:    { icon: Clock,        label: 'En cola',      cls: 'text-white/50',    spin: false },
  PROCESSING: { icon: Loader2,      label: 'Procesando…',  cls: 'text-orange-400',  spin: true  },
  OCR_REQUIRED: { icon: ScanText,   label: 'Necesita reconocimiento de texto', cls: 'text-amber-400', spin: false },
  READY:      { icon: CheckCircle2, label: 'Listo',        cls: 'text-green-400',   spin: false },
  FAILED:     { icon: XCircle,      label: 'Error',        cls: 'text-red-400',     spin: false },
} as const

export default function DocumentStatusCard({ doc }: Props) {
  const info = STATUS_INFO[doc.status] ?? STATUS_INFO.PENDING
  const Icon = info.icon

  return (
    <div className="flex items-center gap-3 bg-surface-card border border-white/8 rounded-xl px-4 py-3">
      <Icon className={`w-5 h-5 flex-shrink-0 ${info.spin ? 'animate-spin' : ''} ${info.cls}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{doc.originalFilename}</p>
        <p className={`text-xs mt-0.5 ${info.cls}`}>{info.label}</p>
      </div>
      {doc.markdownAvailable && (
        <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Markdown ✓</span>
      )}
    </div>
  )
}
