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

  if (!userRole) return fallback ? <>{fallback}</> : <Navigate to="/403" replace />

  const allowed = (() => {
    if (permission) return hasPermission(userRole, permission)
    if (role) return userRole === role
    if (minRole) return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole]
    return true
  })()

  if (!allowed) return fallback ? <>{fallback}</> : <Navigate to="/403" replace />

  return <>{children}</>
}
