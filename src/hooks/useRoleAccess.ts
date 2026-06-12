import { useAuthStore } from '@/store/auth.store'
import { hasPermission, type Permission } from '@/config/roles'

export function useRoleAccess(permission: Permission): boolean {
  const role = useAuthStore((s) => s.role)
  if (!role) return false
  return hasPermission(role, permission)
}
