import { Menu, Flame } from 'lucide-react'
import { useUiStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { useLocation } from 'react-router-dom'
import NotificationBell from '@/features/notifications/components/NotificationBell'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':    'Dashboard',
  '/analytics':    'Analítica',
  '/study':        'Estudiar',
  '/decks':        'Mis Mazos',
  '/documents':    'Documentos',
  '/courses':      'Cursos',
  '/achievements': 'Logros',
  '/store':        'Tienda',
  '/leaderboard':  'Ranking',
  '/profile':      'Perfil',
}

export default function TopBar() {
  const { toggleSidebar } = useUiStore()
  const { currentStreak, xp } = useAuthStore()
  const { pathname } = useLocation()

  const baseRoute = '/' + pathname.split('/')[1]
  const title = PAGE_TITLES[baseRoute] ?? 'StreakStudy'

  return (
    <header className="h-14 bg-surface-card border-b border-surface-border flex items-center gap-4 px-4 shrink-0">
      {/* Sidebar toggle (desktop) */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="text-sm font-semibold text-text-primary flex-1">{title}</h1>

      {/* Right: notifications + streak + XP */}
      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-overlay border border-surface-border">
          <Flame className="w-3.5 h-3.5 text-[#f97316]" />
          <span className="text-xs font-semibold text-text-primary">{currentStreak}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-overlay border border-surface-border">
          <span className="text-xs text-[#a78bfa]">⚡</span>
          <span className="text-xs font-semibold text-text-primary">{xp} XP</span>
        </div>
      </div>
    </header>
  )
}
