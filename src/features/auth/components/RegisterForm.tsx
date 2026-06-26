import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, User, Mail, Lock, Building2 } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { useAuth, handleAuthError } from '../hooks/useAuth'
import { useInstitutionResolver } from '../hooks/useInstitutionResolver'
import { registerSchema, type RegisterFormValues } from '../schemas/auth.schemas'

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register: doRegister } = useAuth()
  const resolver = useInstitutionResolver()

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  // Sync institutionId into the form whenever resolver resolves it
  useEffect(() => {
    if (resolver.institutionId) {
      setValue('institutionId', resolver.institutionId, { shouldValidate: false })
    }
  }, [resolver.institutionId, setValue])

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await doRegister(data)
    } catch (err) {
      handleAuthError(err, (field, msg) =>
        setError(field as keyof RegisterFormValues, { message: msg })
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Institution */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Institución
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          {resolver.mode === 'url-param' ? (
            <div className="pl-10 pr-4 py-3 rounded-lg bg-surface-overlay border border-surface-border text-sm text-text-primary">
              {resolver.isLoading ? (
                <span className="text-text-muted">Cargando…</span>
              ) : (
                <span>{resolver.institutionName ?? `Institución #${resolver.institutionId}`}</span>
              )}
            </div>
          ) : (
            <Input
              type="number"
              placeholder="ID de institución"
              error={!!errors.institutionId}
              className="pl-10"
              value={resolver.institutionId}
              onChange={(e) => {
                const id = Number(e.target.value)
                resolver.setInstitutionId(id)
                setValue('institutionId', id, { shouldValidate: true })
              }}
            />
          )}
        </div>
        {errors.institutionId && (
          <p className="text-xs text-error">{errors.institutionId.message}</p>
        )}
      </div>

      {/* Full name */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Nombre completo
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            type="text"
            placeholder="Ana García"
            autoComplete="name"
            error={!!errors.fullName}
            className="pl-10"
            {...register('fullName')}
          />
        </div>
        {errors.fullName && (
          <p className="text-xs text-error">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
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

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            error={!!errors.password}
            className="pl-10 pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-error">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm password */}
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
            aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-error">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" loading={isSubmitting} className="mt-2">
        {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>
    </form>
  )
}
