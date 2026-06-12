import { useRef, useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface Props {
  onFile: (file: File) => void
  isLoading?: boolean
}

export default function PdfUploadZone({ onFile, isLoading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

  const handle = (file: File) => {
    if (file.type !== 'application/pdf') return
    onFile(file)
  }

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 transition-colors cursor-pointer ${drag ? 'border-orange-500 bg-orange-500/5' : 'border-white/15 hover:border-white/30'}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const file = e.dataTransfer.files[0]; if (file) handle(file) }}
    >
      <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
        {isLoading
          ? <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          : <Upload className="w-7 h-7 text-orange-400" />}
      </div>
      <div className="text-center">
        <p className="font-semibold text-white text-sm">{isLoading ? 'Subiendo...' : 'Arrastra tu PDF aquí'}</p>
        <p className="text-xs text-white/40 mt-0.5">o haz clic para seleccionar</p>
      </div>
      {!isLoading && (
        <Button size="sm" variant="outline">
          <FileText className="w-4 h-4 mr-1" /> Seleccionar PDF
        </Button>
      )}
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f) }} />
    </div>
  )
}
