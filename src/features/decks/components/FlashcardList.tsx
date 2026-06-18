import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import FlashcardItem from './FlashcardItem'
import FlashcardForm from './FlashcardForm'
import EmptyState from '@/shared/components/feedback/EmptyState'
import mascotThinking from '@/assets/brand/mascot-thinking.png'
import { Button } from '@/shared/components/ui/button'
import { useFlashcards } from '@/features/decks/hooks/useFlashcards'
import type { FlashcardResponse } from '@/types/flashcard.types'
import type { FlashcardFormValues } from '@/features/decks/schemas/flashcard.schemas'

interface Props { deckId: number }

export default function FlashcardList({ deckId }: Props) {
  const { data: cards = [], isLoading, createFlashcard, updateFlashcard, deleteFlashcard } = useFlashcards(deckId)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<FlashcardResponse | null>(null)
  const [deleting, setDeleting] = useState<FlashcardResponse | null>(null)

  const handleCreate = async (values: FlashcardFormValues) => {
    await createFlashcard.mutateAsync(values)
    setShowCreate(false)
  }

  const handleUpdate = async (values: FlashcardFormValues) => {
    if (!editing) return
    await updateFlashcard.mutateAsync({ id: editing.id, data: values })
    setEditing(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/50">{cards.length} flashcard{cards.length !== 1 ? 's' : ''}</span>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-1" /> Nueva flashcard
        </Button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-[#1e1f2a] border border-orange-500/30 rounded-xl p-4"
          >
            <h3 className="text-sm font-semibold text-white mb-3">Nueva flashcard</h3>
            <FlashcardForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreate(false)}
              isLoading={createFlashcard.isPending}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {cards.length === 0 && !showCreate ? (
        <EmptyState
          mascot={mascotThinking}
          title="Sin flashcards"
          description="Agrega la primera flashcard a este mazo"
          action={{ label: 'Agregar flashcard', onClick: () => setShowCreate(true) }}
        />
      ) : (
        <div className="space-y-3">
          {cards.map((card) => (
            <div key={card.id}>
              {editing?.id === card.id ? (
                <div className="bg-[#1e1f2a] border border-orange-500/30 rounded-xl p-4">
                  <FlashcardForm
                    defaultValues={card}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditing(null)}
                    isLoading={updateFlashcard.isPending}
                  />
                </div>
              ) : deleting?.id === card.id ? (
                <div className="bg-[#1e1f2a] border border-red-500/30 rounded-xl p-4 space-y-3">
                  <p className="text-sm text-white/70">¿Eliminar esta flashcard?</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setDeleting(null)}>Cancelar</Button>
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => deleteFlashcard.mutateAsync(card.id).then(() => setDeleting(null))}
                      loading={deleteFlashcard.isPending}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ) : (
                <FlashcardItem card={card} onEdit={setEditing} onDelete={setDeleting} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
