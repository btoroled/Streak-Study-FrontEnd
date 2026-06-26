import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, CheckCircle } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { authService } from '@/services/auth.service'
import { getErrorCode } from '@/lib/error.utils'
import { toast } from 'sonner'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas/auth.schemas'

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await authService.forgotPassword(data)
      // Backend always returns 202 to prevent email enumeration
      setSent(true)
    } catch (err) {
      const code = getErrorCode(err)
      if (code === 'too_many_requests') {
        toast.error('Demasiados intentos. Espera antes de solicitar otro enlace.')
      } else {
        // Still show success to prevent enumeration leak
        setSent(true)
      }
    }
  }

  if (sent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-[#22c55e]/10 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-[#22c55e]" />
          </div>
        </div>
        <div>
          <p className="text-text-primary font-medium">Revisa tu correo</p>
          <p className="text-sm text-text-secondary mt-1">
            Si existe una cuenta con ese email, recibirás el enlace de recuperación.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            type="email"
            placeholder="tucorreo@universidad.edu"
            autoComplete="email"
            error={!!errors.email}
            className="pl-10"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-error">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" loading={isSubmitting}>
        {isSubmitting ? 'Enviando…' : 'Enviar enlace de recuperación'}
      </Button>
    </form>
  )
}
