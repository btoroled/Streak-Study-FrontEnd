import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { authService } from '@/services/auth.service'
import { getErrorCode } from '@/lib/error.utils'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/auth.schemas'

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  })

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await authService.resetPassword({ token: data.token, newPassword: data.newPassword })
      navigate('/login?reset=success', { replace: true })
    } catch (err) {
      const code = getErrorCode(err)
      if (code === 'password_reset_token_expired') {
        toast.error('El enlace expiró (válido 30 min). Solicita uno nuevo.')
        navigate('/forgot-password', { replace: true })
      } else if (code === 'invalid_password_reset_token') {
        toast.error('El enlace no es válido. Solicita uno nuevo.')
        navigate('/forgot-password', { replace: true })
      } else {
        toast.error('No se pudo cambiar la contraseña. Intenta de nuevo.')
      }
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-text-secondary text-center py-4">
        Enlace inválido. <br />
        <a href="/forgot-password" className="text-[#7c3aed] hover:underline">
          Solicita uno nuevo
        </a>
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <input type="hidden" {...register('token')} />

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Nueva contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            error={!!errors.newPassword}
            className="pl-10 pr-10"
            {...register('newPassword')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-error">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Confirmar contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            className="pl-10 pr-10"
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            tabIndex={-1}
            aria-label={showConfirm ? 'Ocultar' : 'Mostrar'}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-error">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" loading={isSubmitting}>
        {isSubmitting ? 'Guardando…' : 'Cambiar contraseña'}
      </Button>
    </form>
  )
}
