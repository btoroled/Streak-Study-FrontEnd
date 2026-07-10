import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ShieldCheck } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { getErrorCode, getErrorMessage } from '@/lib/error.utils'
import { verifyEmailSchema, type VerifyEmailFormValues } from '../schemas/auth.schemas'
import { ROUTES } from '@/config/routes'

const RESEND_COOLDOWN_S = 60

export default function VerifyEmailForm() {
  const navigate = useNavigate()
  const [cooldown, setCooldown] = useState(0)
  const [resending, setResending] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormValues>({ resolver: zodResolver(verifyEmailSchema) })

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [cooldown])

  // Sin auto-envío al montar a propósito: cada resend consume el rate-limit
  // del backend, y este componente puede montarse varias veces (banner → pantalla
  // → navegar fuera → volver). El primer código lo pide el usuario con el botón.
  const handleResendClick = async () => {
    setResending(true)
    try {
      await authService.resendVerification()
      setCooldown(RESEND_COOLDOWN_S)
      toast.success('Código enviado. Revisa tu correo.')
    } catch (err) {
      if (getErrorCode(err) === 'too_many_requests') {
        toast.error(getErrorMessage(err, 'Demasiados intentos. Espera antes de reenviar.'))
        setCooldown(RESEND_COOLDOWN_S)
      } else {
        toast.error(getErrorMessage(err))
      }
    } finally {
      setResending(false)
    }
  }

  const onSubmit = async (data: VerifyEmailFormValues) => {
    try {
      await authService.confirmVerification(data)
      useAuthStore.getState().setEmailVerified(true)
      toast.success('Correo verificado')
      navigate(ROUTES.PROFILE, { replace: true })
    } catch (err) {
      if (getErrorCode(err) === 'too_many_requests') {
        toast.error(getErrorMessage(err, 'Demasiados intentos. Espera antes de intentar de nuevo.'))
      } else {
        setError('code', { message: getErrorMessage(err, 'Código incorrecto o vencido') })
      }
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-5">
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-full bg-brand-purple/15 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-brand-purple" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-text-primary font-medium">Verifica tu correo institucional</p>
        <p className="text-sm text-text-secondary mt-1">
          Pide un código de 6 dígitos a tu correo institucional e ingrésalo para confirmar tu cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            Código
          </label>
          <Input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            className="text-center text-lg tracking-[0.5em]"
            error={!!errors.code}
            {...register('code')}
          />
          {errors.code && (
            <p className="text-xs text-error">{errors.code.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Verificando…' : 'Confirmar código'}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResendClick}
          disabled={cooldown > 0 || resending}
          className="text-xs text-brand-purple hover:text-brand-purple-light transition-colors disabled:text-text-muted disabled:cursor-not-allowed"
        >
          {cooldown > 0 ? `Reenviar código (${cooldown}s)` : 'Enviar código'}
        </button>
      </div>
    </div>
  )
}
