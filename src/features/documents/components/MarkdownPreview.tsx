import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { documentsService } from '@/services/documents.service'
import { QK } from '@/lib/query-keys'

interface Props { documentId: number }

export default function MarkdownPreview({ documentId }: Props) {
  const [open, setOpen] = useState(false)

  const { data: markdown, isLoading } = useQuery({
    queryKey: QK.documentMarkdown(documentId),
    queryFn: () => documentsService.getMarkdown(documentId),
    enabled: open,
  })

  return (
    <div className="bg-[#16171f] border border-white/8 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/3 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <FileText className="w-4 h-4 text-white/40" />
          Vista previa Markdown
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
      </button>
      {open && (
        <div className="border-t border-white/8 px-4 py-4 max-h-80 overflow-y-auto">
          {isLoading
            ? <div className="space-y-2 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-3 bg-white/5 rounded" />)}</div>
            : markdown
            ? <pre className="text-xs text-white/70 whitespace-pre-wrap font-mono leading-relaxed">{markdown}</pre>
            : <p className="text-xs text-white/40">Sin contenido disponible.</p>
          }
        </div>
      )}
    </div>
  )
}
