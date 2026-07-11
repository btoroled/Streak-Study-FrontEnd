import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

interface Props {
  /** Oculta el label textual (ej. sidebar colapsado) — deja solo el ícono. */
  compact?: boolean
}

export function ThemeToggle({ compact }: Props) {
  const { theme, setTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors"
      aria-label={isLight ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
    >
      {isLight ? <Moon className="w-4 h-4 shrink-0" /> : <Sun className="w-4 h-4 shrink-0" />}
      {!compact && <span className="text-xs font-medium">{isLight ? 'Oscuro' : 'Claro'}</span>}
    </button>
  )
}
