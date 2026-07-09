import { Layers, Mic } from 'lucide-react'

export default function FlashcardsSection() {
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-5">
      <Layers className="w-6 h-6 text-brand-orange mb-3" />
      <p className="text-sm font-semibold text-text-primary mb-1">Estudio espaciado (SM-2)</p>
      <p className="text-xs text-text-secondary leading-relaxed">
        El algoritmo decide cuándo repasar cada tarjeta para que se te quede de verdad.
      </p>
      <div className="flex items-center gap-1 mt-3 text-[11px] text-brand-purple-light">
        <Mic className="w-3 h-3" />
        <span>Responde por voz — próximamente</span>
      </div>
    </div>
  )
}
