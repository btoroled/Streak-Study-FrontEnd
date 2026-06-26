import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { flashcardsService } from '@/services/flashcards.service'
import { QK } from '@/lib/query-keys'
import { getErrorMessage } from '@/lib/error.utils'
import type { CreateFlashcardRequest, UpdateFlashcardRequest } from '@/types/flashcard.types'

export function useFlashcards(deckId: number) {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)

  const query = useQuery({
    queryKey: QK.flashcards(deckId, page),
    queryFn: ({ signal }) => flashcardsService.listByDeck(deckId, page, signal),
    enabled: deckId > 0,
  })

  const cards = query.data?.content ?? []
  const cardCount = query.data?.totalElements ?? 0
  const totalPages = query.data?.totalPages ?? 0

  const invalidateAll = () => qc.invalidateQueries({ queryKey: QK.flashcardsRoot(deckId) })

  const createFlashcard = useMutation({
    mutationFn: (data: Omit<CreateFlashcardRequest, 'deckId'>) =>
      flashcardsService.create({ ...data, deckId }),
    onSuccess: () => {
      invalidateAll()
      toast.success('Flashcard creada')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const updateFlashcard = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFlashcardRequest }) =>
      flashcardsService.update(id, data),
    onSuccess: () => {
      invalidateAll()
      toast.success('Flashcard actualizada')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const deleteFlashcard = useMutation({
    mutationFn: (id: number) => flashcardsService.remove(id),
    onSuccess: () => {
      invalidateAll()
      toast.success('Flashcard eliminada')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return { ...query, cards, cardCount, page, setPage, totalPages, createFlashcard, updateFlashcard, deleteFlashcard }
}
