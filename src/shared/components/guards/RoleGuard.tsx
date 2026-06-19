import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { hasPermission, type Permission, type UserRole, ROLE_HIERARCHY } from '@/config/roles'

interface RoleGuardProps {
  children: ReactNode
  /** Require a specific permission */
  permission?: Permission
  /** Require an exact role */
  role?: UserRole
  /** Require at least this role in the hierarchy */
  minRole?: UserRole
  /** Custom fallback instead of redirect to /403 */
  fallback?: ReactNode
}

export default function RoleGuard({
  children,
  permission,
  role,
  minRole,
  fallback,
}: RoleGuardProps) {
  const userRole = useAuthStore((s) => s.role)
  // `fallback` provisto (incluso null) → ocultar; sin `fallback` → redirigir a /403.
  // Distinguir null de undefined es clave: fallback={null} oculta sin expulsar.
  const denied = fallback !== undefined ? <>{fallback}</> : <Navigate to="/403" replace />

  if (!userRole) return denied

  const allowed = (() => {
    if (permission) return hasPermission(userRole, permission)
    if (role) return userRole === role
    if (minRole) return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole]
    return true
  })()

  if (!allowed) return denied

  return <>{children}</>
}
