import { useAuthStore } from '@/store/auth.store'

export function useCurrentUser() {
  const userId = useAuthStore((s) => s.userId)
  const institutionId = useAuthStore((s) => s.institutionId)
  const email = useAuthStore((s) => s.email)
  const fullName = useAuthStore((s) => s.fullName)
  const role = useAuthStore((s) => s.role)
  const xp = useAuthStore((s) => s.xp)

  return { userId, institutionId, email, fullName, role, xp }
}
