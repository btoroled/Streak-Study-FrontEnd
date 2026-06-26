import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Layers, FileText, User } from 'lucide-react'
import { cn } from '@/lib/cn'

const items = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/study',     icon: BookOpen,        label: 'Estudiar' },
  { to: '/decks',     icon: Layers,          label: 'Mazos' },
  { to: '/documents', icon: FileText,        label: 'Docs' },
  { to: '/profile',   icon: User,            label: 'Perfil' },
]

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-card border-t border-surface-border">
      <div className="flex">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors',
                isActive ? 'text-[#f97316]' : 'text-text-muted'
              )
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
