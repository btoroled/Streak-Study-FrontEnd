import { BookOpen, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DeckResponse } from '@/types/deck.types'

interface Props {
  deck: DeckResponse
  onEdit: (deck: DeckResponse) => void
  onDelete: (deck: DeckResponse) => void
}

export default function DeckCard({ deck, onEdit, onDelete }: Props) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="relative bg-surface-card border border-white/8 rounded-xl p-4 hover:border-orange-500/40 transition-colors cursor-pointer"
      onClick={() => navigate(`/decks/${deck.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500/15 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-orange-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">{deck.name}</h3>
            {deck.description && (
              <p className="text-sm text-white/50 truncate mt-0.5">{deck.description}</p>
            )}
          </div>
        </div>

        <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-surface-overlay border border-white/10 rounded-xl shadow-xl overflow-hidden w-40">
                <button
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/8 transition-colors"
                  onClick={() => { setMenuOpen(false); onEdit(deck) }}
                >
                  <Pencil className="w-4 h-4" /> Editar
                </button>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/8 transition-colors"
                  onClick={() => { setMenuOpen(false); onDelete(deck) }}
                >
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-white/35">
        Creado {new Date(deck.createdAt).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })}
      </div>
    </div>
  )
}
