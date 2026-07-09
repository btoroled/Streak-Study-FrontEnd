import type { UserRole } from '@/config/roles'
import { useAuthStore } from '@/store/auth.store'
import { getUserLevel } from '@/lib/xp.utils'
import { LevelAvatar } from '@/shared/components/gamification/LevelAvatar'

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
  const xp = useAuthStore((s) => s.xp)
  const levelInfo = getUserLevel(xp)

  return (
    <div className="flex items-center gap-4">
      <LevelAvatar level={levelInfo.level} size={64} showBadge alt={levelInfo.name} />
      <div>
        <h2 className="text-lg font-bold text-text-primary">{fullName ?? 'Usuario'}</h2>
        <p className="text-sm text-text-secondary">{email}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400">
            {levelInfo.name}
          </span>
          {role && (
            <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400">
              {ROLE_LABEL[role] ?? role}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
