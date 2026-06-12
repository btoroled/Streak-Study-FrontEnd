import { z } from 'zod'

export const deckSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
})

export type DeckFormValues = z.infer<typeof deckSchema>
