import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { ASSIGNABLE_ROLES } from '@/config/roles'
import { institutionsService } from '@/services/institutions.service'
import { QK } from '@/lib/query-keys'
import { useCreateUser, handleCreateUserError } from '../hooks/useCreateUser'
import {
  createUserSchema,
  superAdminCreateUserSchema,
  type CreateUserFormValues,
} from '../schemas/create-user.schemas'

const ROLE_LABELS: Record<string, string> = {
  STUDENT: 'Estudiante',
  TEACHER: 'Profesor',
  INSTITUTION_ADMIN: 'Admin de institución',
}

export default function CreateUserForm() {
  const [showPassword, setShowPassword] = useState(false)
  const currentRole = useAuthStore((s) => s.role)
  const assignableRoles = currentRole ? ASSIGNABLE_ROLES[currentRole] : []
  // SUPER_ADMIN crea cross-tenant (B.9): elige institución destino explícita.
  const isSuperAdmin = currentRole === 'SUPER_ADMIN'
  const createUser = useCreateUser()

  const institutionsQuery = useQuery({
    queryKey: QK.institutions,
    queryFn: () => institutionsService.list(),
    enabled: isSuperAdmin,
    staleTime: 5 * 60 * 1000,
  })

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormValues>({
    // Para no-SUPER_ADMIN se valida sin institutionId (el backend lo infiere);
    // el cast es necesario porque los dos schemas producen shapes distintos.
    resolver: zodResolver(
      isSuperAdmin ? superAdminCreateUserSchema : createUserSchema,
    ) as unknown as Resolver<CreateUserFormValues>,
    defaultValues: { role: assignableRoles[0] as CreateUserFormValues['role'] },
  })

  const onSubmit = async (data: CreateUserFormValues) => {
    // Solo SUPER_ADMIN manda institutionId; para el resto el backend lo
    // infiere del creador y mandarlo es un 400 (unexpected_institution_id).
    const { institutionId, ...rest } = data
    const payload = isSuperAdmin ? { ...rest, institutionId } : rest
    try {
      const created = await createUser.mutateAsync(payload)
      toast.success(`Usuario ${created.email} creado`)
      reset({ role: data.role, fullName: '', email: '', password: '' })
    } catch (err) {
      handleCreateUserError(err, (field, msg) =>
        setError(field as keyof CreateUserFormValues, { message: msg }),
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label
          htmlFor="create-user-fullname"
          className="text-xs font-medium text-text-secondary uppercase tracking-wide"
        >
          Nombre completo
        </label>
        <Input
          id="create-user-fullname"
          type="text"
          placeholder="Ana García"
          error={!!errors.fullName}
          {...register('fullName')}
        />
        {errors.fullName && <p className="text-xs text-error">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="create-user-email"
          className="text-xs font-medium text-text-secondary uppercase tracking-wide"
        >
          Email
        </label>
        <Input
          id="create-user-email"
          type="email"
          placeholder="correo@universidad.edu"
          error={!!errors.email}
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="create-user-password"
          className="text-xs font-medium text-text-secondary uppercase tracking-wide"
        >
          Contraseña inicial
        </label>
        <div className="relative">
          <Input
            id="create-user-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            error={!!errors.password}
            className="pr-10"
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
        {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="create-user-role"
          className="text-xs font-medium text-text-secondary uppercase tracking-wide"
        >
          Rol
        </label>
        <select
          id="create-user-role"
          disabled={assignableRoles.length <= 1}
          className="w-full px-4 py-3 rounded-lg bg-surface-overlay border border-surface-border text-sm text-text-primary disabled:opacity-60 disabled:cursor-not-allowed"
          {...register('role')}
        >
          {assignableRoles.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role] ?? role}
            </option>
          ))}
        </select>
        {errors.role && <p className="text-xs text-error">{errors.role.message}</p>}
      </div>

      {isSuperAdmin && (
        <div className="space-y-1.5">
          <label
            htmlFor="create-user-institution"
            className="text-xs font-medium text-text-secondary uppercase tracking-wide"
          >
            Institución
          </label>
          <select
            id="create-user-institution"
            className="w-full px-4 py-3 rounded-lg bg-surface-overlay border border-surface-border text-sm text-text-primary"
            defaultValue=""
            {...register('institutionId', {
              setValueAs: (v) => (v === '' ? undefined : Number(v)),
            })}
          >
            <option value="" disabled>
              {institutionsQuery.isLoading ? 'Cargando…' : 'Elige una institución…'}
            </option>
            {(institutionsQuery.data ?? []).map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name}
              </option>
            ))}
          </select>
          {errors.institutionId && (
            <p className="text-xs text-error">{errors.institutionId.message}</p>
          )}
        </div>
      )}

      <Button type="submit" size="sm" loading={isSubmitting}>
        {isSubmitting ? 'Creando…' : 'Crear usuario'}
      </Button>
    </form>
  )
}
