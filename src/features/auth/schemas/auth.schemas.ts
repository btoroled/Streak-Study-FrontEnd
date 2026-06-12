import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

export const registerSchema = z
  .object({
    institutionId: z.number({ error: 'Selecciona una institución' }),
    fullName: z
      .string()
      .min(1, 'El nombre es requerido')
      .max(120, 'Máximo 120 caracteres'),
    email: z.string().email('El email no es válido'),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .max(100, 'Máximo 100 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('El email no es válido'),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
