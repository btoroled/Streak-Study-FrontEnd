import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useDecks } from '@/features/decks/hooks/useDecks'
import type { DocumentStatusResponse } from '@/types/document.types'

interface Props {
  doc: DocumentStatusResponse
  onGenerate: (deckId: number) => Promise<void>
  isLoading?: boolean
}

export default function GenerateFlashcardsForm({ doc, onGenerate, isLoading }: Props) {
  const { data: decks = [] } = useDecks()
  const [deckId, setDeckId] = useState<number | ''>('')

  if (doc.status !== 'READY') return null

  return (
    <div className="bg-purple-500/10 border border-purple-500/25 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-purple-300">Generar flashcards con IA</span>
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs text-white/50">Mazo destino</label>
        <select
          value={deckId}
          onChange={(e) => setDeckId(Number(e.target.value) || '')}
          className="w-full bg-[#1a1b26] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/60"
        >
          <option value="">Seleccionar mazo…</option>
          {decks.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>
      <Button
        className="w-full bg-purple-600 hover:bg-purple-700"
        loading={isLoading}
        disabled={!deckId}
        onClick={() => deckId && onGenerate(Number(deckId))}
      >
        <Sparkles className="w-4 h-4 mr-1" /> Generar flashcards
      </Button>
    </div>
  )
}
