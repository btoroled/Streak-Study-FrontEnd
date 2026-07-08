import { z } from 'zod'

// Schema estático: no sabe quién es el usuario actual. Qué roles puede
// ofrecer el select lo decide ASSIGNABLE_ROLES (config/roles.ts) en el form.
export const createUserSchema = z.object({
  fullName: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(120, 'Máximo 120 caracteres'),
  email: z.string().email('El email no es válido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  role: z.enum(['STUDENT', 'TEACHER', 'INSTITUTION_ADMIN']),
})

// SUPER_ADMIN crea cross-tenant (B.9): la institución destino es obligatoria.
export const superAdminCreateUserSchema = createUserSchema.extend({
  institutionId: z.number({ error: 'Selecciona una institución' }),
})

// institutionId es opcional en el tipo (solo SUPER_ADMIN lo completa); el
// schema activo en el form decide si es obligatorio.
export type CreateUserFormValues = z.infer<typeof createUserSchema> & {
  institutionId?: number
}
