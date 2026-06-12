import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { flashcardsService } from '@/services/flashcards.service'
import { QK } from '@/lib/query-keys'
import { getErrorMessage } from '@/lib/error.utils'
import type { CreateFlashcardRequest, UpdateFlashcardRequest } from '@/types/flashcard.types'

export function useFlashcards(deckId: number) {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: QK.flashcards(deckId),
    queryFn: () => flashcardsService.listByDeck(deckId),
    enabled: deckId > 0,
  })

  const cardCount = query.data?.length ?? 0

  const createFlashcard = useMutation({
    mutationFn: (data: Omit<CreateFlashcardRequest, 'deckId'>) =>
      flashcardsService.create({ ...data, deckId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.flashcards(deckId) })
      toast.success('Flashcard creada')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const updateFlashcard = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFlashcardRequest }) =>
      flashcardsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.flashcards(deckId) })
      toast.success('Flashcard actualizada')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const deleteFlashcard = useMutation({
    mutationFn: (id: number) => flashcardsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.flashcards(deckId) })
      toast.success('Flashcard eliminada')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return { ...query, cardCount, createFlashcard, updateFlashcard, deleteFlashcard }
}
