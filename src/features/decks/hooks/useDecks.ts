import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { decksService } from '@/services/decks.service'
import { QK } from '@/lib/query-keys'
import { getErrorMessage } from '@/lib/error.utils'
import type { CreateDeckRequest, UpdateDeckRequest } from '@/types/deck.types'

export function useDecks() {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: QK.decks,
    queryFn: decksService.list,
  })

  const createDeck = useMutation({
    mutationFn: (data: CreateDeckRequest) => decksService.create(data),
    onSuccess: (deck) => {
      qc.invalidateQueries({ queryKey: QK.decks })
      toast.success(`Mazo "${deck.name}" creado`)
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const updateDeck = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDeckRequest }) =>
      decksService.update(id, data),
    onSuccess: (deck) => {
      qc.invalidateQueries({ queryKey: QK.decks })
      qc.invalidateQueries({ queryKey: QK.deck(deck.id) })
      toast.success('Mazo actualizado')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const deleteDeck = useMutation({
    mutationFn: (id: number) => decksService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.decks })
      toast.success('Mazo eliminado')
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  return { ...query, createDeck, updateDeck, deleteDeck }
}

export function useDeckDetail(deckId: number) {
  return useQuery({
    queryKey: QK.deck(deckId),
    queryFn: () => decksService.get(deckId),
    enabled: deckId > 0,
  })
}
