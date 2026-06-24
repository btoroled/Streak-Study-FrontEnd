import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { Button } from '../ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'streakstudy-install-dismissed'

/** Banner de instalación de la PWA — usa el evento nativo en vez del prompt default del navegador. */
export default function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === '1')

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!deferredEvent || dismissed) return null

  const dismiss = () => {
    setDismissed(true)
    localStorage.setItem(DISMISSED_KEY, '1')
  }

  const install = async () => {
    await deferredEvent.prompt()
    await deferredEvent.userChoice
    setDeferredEvent(null)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-40 bg-surface-overlay border border-surface-border rounded-2xl p-4 shadow-2xl flex items-start gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-brand-purple/15 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-brand-purple" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">Instalar StreakStudy</p>
          <p className="text-xs text-text-muted mt-0.5">Acceso rápido desde tu pantalla de inicio, sin abrir el navegador.</p>
          <Button size="sm" className="mt-3 w-full" onClick={install}>
            Instalar
          </Button>
        </div>
        <button
          onClick={dismiss}
          className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/8 transition-colors shrink-0"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
