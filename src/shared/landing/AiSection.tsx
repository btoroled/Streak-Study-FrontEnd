import { Sparkles } from 'lucide-react'

export default function AiSection() {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5">
      <Sparkles className="w-6 h-6 text-brand-purple-light mb-3" />
      <p className="text-sm font-semibold text-text-primary mb-1">IA desde tus PDFs</p>
      <p className="text-xs text-text-secondary leading-relaxed">
        Sube un documento y genera flashcards automáticamente, sin escribir nada a mano.
      </p>
    </div>
  )
}
