import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, LineChart, BookOpen, Layers, FileText, GraduationCap,
  Trophy, ShoppingBag, BarChart2, User, Flame, ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react'
import logoMark from '@/assets/brand/logo-mark.png'
import { LevelAvatar } from '@/shared/components/gamification/LevelAvatar'
import { useUiStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getUserLevel } from '@/lib/xp.utils'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { useFeatureFlag } from '@/hooks/useFeatureFlag'
import { cn } from '@/lib/cn'

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics',    icon: LineChart,       label: 'Analítica' },
  { to: '/study',        icon: BookOpen,        label: 'Estudiar' },
  { to: '/decks',        icon: Layers,          label: 'Mazos' },
  { to: '/documents',    icon: FileText,        label: 'Documentos' },
  { to: '/courses',      icon: GraduationCap,   label: 'Cursos' },
  { to: '/achievements', icon: Trophy,          label: 'Logros' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUiStore()
  const { xp, currentStreak, fullName, email } = useAuthStore()
  const canViewStore = useRoleAccess('view:store')
  const leaderboardEnabled = useFeatureFlag('LEADERBOARD')
  const { logout } = useAuth()
  const navigate = useNavigate()
  const levelInfo = getUserLevel(xp)

  const displayName = fullName ?? email ?? 'Usuario'

  const allNavItems = [
    ...navItems,
    ...(canViewStore ? [{ to: '/store', icon: ShoppingBag, label: 'Tienda' }] : []),
    ...(leaderboardEnabled ? [{ to: '/leaderboard', icon: BarChart2, label: 'Ranking' }] : []),
    { to: '/profile', icon: User, label: 'Perfil' },
  ]

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 240 : 64 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="hidden lg:flex flex-col bg-[#16171f] border-r border-[#2a2b38] shrink-0 overflow-hidden relative z-10"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[#2a2b38] shrink-0">
        <img src={logoMark} alt="StreakStudy" className="w-9 h-9 shrink-0 object-contain" />
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-bold text-[#f1f0f5] whitespace-nowrap overflow-hidden"
            >
              StreakStudy
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="ml-auto text-[#5e5c70] hover:text-[#9896a8] transition-colors shrink-0"
          aria-label={sidebarOpen ? 'Colapsar sidebar' : 'Expandir sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {allNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative',
                isActive
                  ? 'bg-[#252636] text-[#f1f0f5] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-[#f97316]'
                  : 'text-[#9896a8] hover:bg-[#1e1f2a] hover:text-[#f1f0f5]'
              )
            }
          >
            <Icon className="w-4.5 h-4.5 shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Bottom: XP card + logout */}
      <div className="border-t border-[#2a2b38] p-3 space-y-2 shrink-0">
        {/* Streak + level mini-card */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-2 py-2 rounded-lg bg-[#1e1f2a] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#9896a8]">{levelInfo.name}</span>
                <span className="text-xs text-[#f97316] font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3" />{currentStreak}
                </span>
              </div>
              <div className="h-1 rounded-full bg-[#2a2b38] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(levelInfo.progress * 100)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#f97316] to-[#7c3aed] rounded-full"
                />
              </div>
              <p className="text-xs text-[#5e5c70]">{xp} XP</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User row */}
        <div className="flex items-center gap-2 px-2 py-1">
          <div onClick={() => navigate('/profile')} className="cursor-pointer">
            <LevelAvatar level={levelInfo.level} size={28} alt={displayName} />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-medium text-[#f1f0f5] truncate">{displayName}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={logout}
            className="shrink-0 text-[#5e5c70] hover:text-[#ef4444] transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
