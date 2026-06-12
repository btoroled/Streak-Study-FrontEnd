import { AlertTriangle } from 'lucide-react'

interface Props {
  filename: string
  onContinue: () => void
  onCancel: () => void
}

export default function DuplicateAlert({ filename, onContinue, onCancel }: Props) {
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-yellow-300">Documento duplicado detectado</p>
          <p className="text-xs text-yellow-300/70 mt-0.5">
            <span className="font-medium">"{filename}"</span> ya fue procesado anteriormente.
          </p>
        </div>
      </div>
      <div className="flex gap-3 pl-8">
        <button className="text-xs text-white/50 hover:text-white transition-colors" onClick={onCancel}>Cancelar</button>
        <button className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium" onClick={onContinue}>
          Continuar de todas formas →
        </button>
      </div>
    </div>
  )
}
