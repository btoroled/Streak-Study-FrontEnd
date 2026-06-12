export type UserRole = 'STUDENT' | 'TEACHER' | 'INSTITUTION_ADMIN' | 'SUPER_ADMIN'

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  STUDENT: 1,
  TEACHER: 2,
  INSTITUTION_ADMIN: 3,
  SUPER_ADMIN: 4,
}

export type Permission =
  | 'view:dashboard'
  | 'manage:deck'
  | 'manage:flashcard'
  | 'upload:document'
  | 'view:courses'
  | 'create:course'
  | 'delete:course'
  | 'finish:review'
  | 'buy:streak-freeze'
  | 'buy:badge'
  | 'view:store'
  | 'view:leaderboard'
  | 'view:profile'

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  STUDENT: [
    'view:dashboard', 'manage:deck', 'manage:flashcard', 'upload:document',
    'view:courses', 'finish:review', 'buy:streak-freeze', 'buy:badge',
    'view:store', 'view:leaderboard', 'view:profile',
  ],
  TEACHER: [
    'view:dashboard', 'manage:deck', 'manage:flashcard', 'upload:document',
    'view:courses', 'create:course', 'view:leaderboard', 'view:profile',
  ],
  INSTITUTION_ADMIN: [
    'view:dashboard', 'manage:deck', 'manage:flashcard', 'upload:document',
    'view:courses', 'create:course', 'delete:course', 'view:leaderboard', 'view:profile',
  ],
  SUPER_ADMIN: [
    'view:dashboard', 'manage:deck', 'manage:flashcard', 'upload:document',
    'view:courses', 'create:course', 'delete:course', 'view:leaderboard', 'view:profile',
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
