import { z } from 'zod'

export const flashcardSchema = z.object({
  question: z.string().min(1, 'La pregunta es requerida'),
  answer: z.string().min(1, 'La respuesta es requerida'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
})

export type FlashcardFormValues = z.infer<typeof flashcardSchema>
