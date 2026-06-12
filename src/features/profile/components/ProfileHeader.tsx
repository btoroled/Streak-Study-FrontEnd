import type { UserRole } from '@/config/roles'

const ROLE_LABEL: Record<string, string> = {
  STUDENT: 'Estudiante',
  TEACHER: 'Docente',
  INSTITUTION_ADMIN: 'Admin. Institución',
  SUPER_ADMIN: 'Super Admin',
}

interface Props {
  fullName: string | null
  email: string | null
  role: UserRole | null
}

export default function ProfileHeader({ fullName, email, role }: Props) {
  const initials = fullName
    ? fullName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
        {initials}
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">{fullName ?? 'Usuario'}</h2>
        <p className="text-sm text-white/50">{email}</p>
        {role && (
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400">
            {ROLE_LABEL[role] ?? role}
          </span>
        )}
      </div>
    </div>
  )
}
