import { useMemo, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import DeckGrid from '@/features/decks/components/DeckGrid'
import DeckForm from '@/features/decks/components/DeckForm'
import DeckDeleteDialog from '@/features/decks/components/DeckDeleteDialog'
import ApiErrorDisplay from '@/shared/components/feedback/ApiErrorDisplay'
import EmptyState from '@/shared/components/feedback/EmptyState'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useDecks } from '@/features/decks/hooks/useDecks'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { DeckResponse } from '@/types/deck.types'
import type { DeckFormValues } from '@/features/decks/schemas/deck.schemas'

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; deck: DeckResponse }
  | { type: 'delete'; deck: DeckResponse }
  | null

type SortOrder = 'recent' | 'name'

export default function DecksPage() {
  const { data: decks = [], isLoading, error, refetch, createDeck, updateDeck, deleteDeck } = useDecks()
  const [modal, setModal] = useState<ModalState>(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOrder>('recent')
  const debouncedSearch = useDebouncedValue(search)

  const visibleDecks = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase()
    const filtered = term
      ? decks.filter((d) => d.name.toLowerCase().includes(term) || d.description?.toLowerCase().includes(term))
      : decks

    return [...filtered].sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name)
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [decks, debouncedSearch, sort])

  const handleSubmit = async (values: DeckFormValues) => {
    if (modal?.type === 'create') {
      await createDeck.mutateAsync(values)
    } else if (modal?.type === 'edit') {
      await updateDeck.mutateAsync({ id: modal.deck.id, data: values })
    }
    setModal(null)
  }

  const handleDelete = async () => {
    if (modal?.type !== 'delete') return
    await deleteDeck.mutateAsync(modal.deck.id)
    setModal(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <ApiErrorDisplay error={error} onRetry={() => refetch()} />
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Mazos</h1>
          <p className="text-sm text-white/50 mt-0.5">{decks.length} mazo{decks.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setModal({ type: 'create' })}>
          <Plus className="w-4 h-4 mr-1" /> Nuevo mazo
        </Button>
      </div>

      {decks.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input
              placeholder="Buscar mazo por nombre o descripción…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOrder)}
            className="bg-surface-overlay border border-surface-border rounded-lg px-3 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30"
          >
            <option value="recent">Más reciente</option>
            <option value="name">Nombre (A-Z)</option>
          </select>
        </div>
      )}

      {decks.length > 0 && visibleDecks.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Sin resultados"
          description={`No encontramos mazos que coincidan con "${debouncedSearch}"`}
        />
      ) : (
        <DeckGrid
          decks={visibleDecks}
          onEdit={(deck) => setModal({ type: 'edit', deck })}
          onDelete={(deck) => setModal({ type: 'delete', deck })}
          onCreateFirst={() => setModal({ type: 'create' })}
        />
      )}

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
              className="relative z-10 w-full max-w-md bg-[#16171f] border border-white/10 rounded-2xl p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">
                  {modal.type === 'create' ? 'Nuevo mazo' : modal.type === 'edit' ? 'Editar mazo' : 'Eliminar mazo'}
                </h2>
                <button
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors"
                  onClick={() => setModal(null)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {modal.type === 'delete' ? (
                <DeckDeleteDialog
                  deck={modal.deck}
                  onConfirm={handleDelete}
                  onCancel={() => setModal(null)}
                  isLoading={deleteDeck.isPending}
                />
              ) : (
                <DeckForm
                  defaultValues={modal.type === 'edit' ? modal.deck : undefined}
                  onSubmit={handleSubmit}
                  onCancel={() => setModal(null)}
                  isLoading={createDeck.isPending || updateDeck.isPending}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
