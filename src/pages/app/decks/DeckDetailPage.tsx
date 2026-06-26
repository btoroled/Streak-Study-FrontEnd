import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, X, Pencil } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FlashcardList from '@/features/decks/components/FlashcardList'
import DeckForm from '@/features/decks/components/DeckForm'
import DeckDeleteDialog from '@/features/decks/components/DeckDeleteDialog'
import ApiErrorDisplay from '@/shared/components/feedback/ApiErrorDisplay'
import { Button } from '@/shared/components/ui/button'
import { useDeckDetail, useDecks } from '@/features/decks/hooks/useDecks'
import type { DeckFormValues } from '@/features/decks/schemas/deck.schemas'

type ModalState = 'edit' | 'delete' | null

export default function DeckDetailPage() {
  const { deckId } = useParams<{ deckId: string }>()
  const id = Number(deckId)
  const navigate = useNavigate()
  const { data: deck, isLoading, error, refetch } = useDeckDetail(id)
  const { updateDeck, deleteDeck } = useDecks()
  const [modal, setModal] = useState<ModalState>(null)

  const handleUpdate = async (values: DeckFormValues) => {
    await updateDeck.mutateAsync({ id, data: values })
    setModal(null)
  }

  const handleDelete = async () => {
    await deleteDeck.mutateAsync(id)
    navigate('/decks')
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse" />
        <div className="h-4 w-40 bg-white/5 rounded-lg animate-pulse" />
        <div className="space-y-3 mt-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (error || !deck) {
    return <ApiErrorDisplay error={error} onRetry={() => refetch()} />
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <button
            className="mt-1 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors flex-shrink-0"
            onClick={() => navigate('/decks')}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{deck.name}</h1>
            {deck.description && (
              <p className="text-sm text-white/50 mt-0.5">{deck.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setModal('edit')}>
            <Pencil className="w-4 h-4 mr-1" /> Editar
          </Button>
          <Button size="sm" onClick={() => navigate(`/study/${id}`)}>
            <Play className="w-4 h-4 mr-1" /> Estudiar
          </Button>
        </div>
      </div>

      <FlashcardList deckId={id} />

      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setModal(null)}
            />
            <motion.div
              className="relative z-10 w-full max-w-md bg-surface-card border border-white/10 rounded-2xl p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">
                  {modal === 'edit' ? 'Editar mazo' : 'Eliminar mazo'}
                </h2>
                <button
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors"
                  onClick={() => setModal(null)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {modal === 'delete' ? (
                <DeckDeleteDialog
                  deck={deck}
                  onConfirm={handleDelete}
                  onCancel={() => setModal(null)}
                  isLoading={deleteDeck.isPending}
                />
              ) : (
                <DeckForm
                  defaultValues={deck}
                  onSubmit={handleUpdate}
                  onCancel={() => setModal(null)}
                  isLoading={updateDeck.isPending}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
