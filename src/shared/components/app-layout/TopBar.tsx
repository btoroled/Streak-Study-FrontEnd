import { Menu, Flame } from 'lucide-react'
import { useUiStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':    'Dashboard',
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
    <header className="h-14 bg-[#16171f] border-b border-[#2a2b38] flex items-center gap-4 px-4 shrink-0">
      {/* Sidebar toggle (desktop) */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex text-[#9896a8] hover:text-[#f1f0f5] transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="text-sm font-semibold text-[#f1f0f5] flex-1">{title}</h1>

      {/* Right: streak + XP */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1e1f2a] border border-[#2a2b38]">
          <Flame className="w-3.5 h-3.5 text-[#f97316]" />
          <span className="text-xs font-semibold text-[#f1f0f5]">{currentStreak}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1e1f2a] border border-[#2a2b38]">
          <span className="text-xs text-[#a78bfa]">⚡</span>
          <span className="text-xs font-semibold text-[#f1f0f5]">{xp} XP</span>
        </div>
      </div>
    </header>
  )
}
