import { KeyRound, Sun, Moon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Button } from '@/shared/components/ui/button'

export default function SecuritySection() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <KeyRound className="w-4 h-4 text-text-muted" />
        <span className="text-sm font-medium text-text-primary">Seguridad</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/forgot-password')}
      >
        Cambiar contraseña
      </Button>

      <div className="flex items-center justify-between pt-3 border-t border-surface-border">
        <span className="text-sm font-medium text-text-primary">Tema</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(isLight ? 'dark' : 'light')}
        >
          {isLight ? <Moon className="w-4 h-4 mr-1.5" /> : <Sun className="w-4 h-4 mr-1.5" />}
          {isLight ? 'Oscuro' : 'Claro'}
        </Button>
      </div>
    </div>
  )
}
