import { useNavigate } from 'react-router-dom'
import { Flame } from 'lucide-react'

export default function FooterSection() {
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-surface-border">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-orange to-brand-purple flex items-center justify-center">
            <Flame className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-text-primary">StreakStudy</span>
        </div>

        <div className="flex items-center gap-5 text-xs text-text-secondary">
          <button onClick={() => navigate('/login')} className="hover:text-text-primary transition-colors">
            Iniciar sesión
          </button>
          <button onClick={() => navigate('/register')} className="hover:text-text-primary transition-colors">
            Crear cuenta
          </button>
        </div>

        <p className="text-xs text-text-muted">© {year} StreakStudy</p>
      </div>
    </footer>
  )
}
