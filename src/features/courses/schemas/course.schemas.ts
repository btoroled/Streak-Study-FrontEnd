import { z } from 'zod'

export const courseSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().max(2000).optional(),
})

export type CourseFormValues = z.infer<typeof courseSchema>
