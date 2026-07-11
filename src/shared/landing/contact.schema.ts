import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Ingresa tu nombre'),
  email: z.string().email('Ingresa un correo válido'),
  institution: z.string().optional(),
  message: z.string().min(10, 'Cuéntanos un poco más (mínimo 10 caracteres)'),
})

export type ContactFormValues = z.infer<typeof contactSchema>
