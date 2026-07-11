import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, LineChart, BookOpen, Layers, FileText, GraduationCap,
  Trophy, ShoppingBag, BarChart2, User, ShieldCheck,
} from 'lucide-react'
import { hasPermission, type Permission, type UserRole } from './roles'
import type { FeatureFlag } from './featureFlags'

export interface NavItem {
  to: string
  icon: LucideIcon
  label: string
  /** Sin permission = visible para todos los roles autenticados. */
  permission?: Permission
  featureFlag?: FeatureFlag
}

// Fuente única del menú de la app (Sidebar y cualquier nav futura): el
// gating por rol vive acá, no esparcido en los componentes.
export const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics',    icon: LineChart,       label: 'Analítica' },
  { to: '/study',        icon: BookOpen,        label: 'Estudiar' },
  { to: '/decks',        icon: Layers,          label: 'Mazos' },
  { to: '/documents',    icon: FileText,        label: 'Documentos' },
  { to: '/courses',      icon: GraduationCap,   label: 'Cursos', permission: 'view:courses' },
  { to: '/achievements', icon: Trophy,          label: 'Logros' },
  { to: '/store',        icon: ShoppingBag,     label: 'Tienda', permission: 'view:store' },
  { to: '/leaderboard',  icon: BarChart2,       label: 'Ranking', permission: 'view:leaderboard', featureFlag: 'LEADERBOARD' },
  { to: '/admin',        icon: ShieldCheck,     label: 'Plataforma', permission: 'view:admin' },
  { to: '/profile',      icon: User,            label: 'Perfil', permission: 'view:profile' },
]

export function filterNavItems(
  role: UserRole | null,
  isFlagEnabled: (flag: FeatureFlag) => boolean,
): NavItem[] {
  if (!role) return []
  return NAV_ITEMS.filter((item) => {
    if (item.permission && !hasPermission(role, item.permission)) return false
    if (item.featureFlag && !isFlagEnabled(item.featureFlag)) return false
    return true
  })
}
