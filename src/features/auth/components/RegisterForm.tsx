import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Eye, EyeOff, User, Mail, Lock, Building2 } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { institutionsService } from '@/services/institutions.service'
import { QK } from '@/lib/query-keys'
import { useAuth, handleAuthError } from '../hooks/useAuth'
import { useInstitutionResolver } from '../hooks/useInstitutionResolver'
import { registerSchema, type RegisterFormValues } from '../schemas/auth.schemas'
import PasswordStrengthMeter from './PasswordStrengthMeter'

// Nombre con el que el backend siembra la institución sentinel (InstitutionSeeder).
// Solo se usa para ordenarla al final del selector — funcionalmente es una más.
const NONE_INSTITUTION_NAME = 'Sin institución'

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const selectedInstitutionId = useWatch({ control, name: 'institutionId' })
  const passwordValue = useWatch({ control, name: 'password' }) ?? ''

  const institutionsQuery = useQuery({
    queryKey: QK.institutions,
    queryFn: () => institutionsService.list(),
    enabled: resolver.mode === 'manual',
    staleTime: 5 * 60 * 1000,
    select: (list) =>
      [...list].sort(
        (a, b) =>
          Number(a.name === NONE_INSTITUTION_NAME) - Number(b.name === NONE_INSTITUTION_NAME),
      ),
  })

  // Sync institutionId into the form when it's fixed by an invite link (?iid=)
  const urlInstitutionId = resolver.mode === 'url-param' ? resolver.institutionId : null
  useEffect(() => {
    if (urlInstitutionId) {
      setValue('institutionId', urlInstitutionId, { shouldValidate: false })
    }
  }, [urlInstitutionId, setValue])

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await doRegister(resolver.courseId ? { ...data, courseId: resolver.courseId } : data)
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
        {resolver.mode === 'url-param' ? (
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <div className="pl-10 pr-4 py-3 rounded-lg bg-surface-overlay border border-surface-border text-sm text-text-primary">
              {resolver.isLoading ? (
                <span className="text-text-muted">Cargando…</span>
              ) : (
                <span>{resolver.institutionName ?? `Institución #${resolver.institutionId}`}</span>
              )}
            </div>
          </div>
        ) : institutionsQuery.isLoading ? (
          <p className="text-sm text-text-muted py-2">Cargando instituciones…</p>
        ) : institutionsQuery.isError ? (
          <p className="text-sm text-error py-2">
            No se pudieron cargar las instituciones. Intenta de nuevo.
          </p>
        ) : (
          <div role="radiogroup" aria-label="Institución" className="flex flex-wrap gap-2">
            {(institutionsQuery.data ?? []).map((inst) => {
              const isActive = selectedInstitutionId === inst.id
              return (
                <button
                  key={inst.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setValue('institutionId', inst.id, { shouldValidate: true })}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-purple text-white font-semibold'
                      : 'bg-surface-overlay border border-surface-border text-text-secondary hover:border-brand-purple/50'
                  }`}
                >
                  {inst.name}
                </button>
              )
            })}
          </div>
        )}
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
        <PasswordStrengthMeter password={passwordValue} />
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
