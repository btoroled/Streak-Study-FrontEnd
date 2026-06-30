import { useState, useRef, useEffect } from 'react'
import { Bell, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUnreadCount, useNotifications } from '../hooks/useNotifications'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'ahora'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.floor(h / 24)
  return `hace ${d} d`
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: unread = 0 } = useUnreadCount()
  const { items, isLoading, markRead, markAllRead } = useNotifications(open)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative text-text-secondary hover:text-text-primary transition-colors p-1"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#f97316] text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 max-h-[420px] overflow-hidden flex flex-col rounded-xl bg-surface-card border border-surface-border shadow-2xl z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
              <span className="text-sm font-semibold text-white">Notificaciones</span>
              {unread > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="text-xs text-orange-400 hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Marcar todas
                </button>
              )}
            </div>

            <div className="overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-2">
                  {[0, 1, 2].map((i) => <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />)}
                </div>
              ) : items.length === 0 ? (
                <p className="text-sm text-white/40 text-center py-10">No tienes notificaciones</p>
              ) : (
                items.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => !n.read && markRead.mutate(n.id)}
                    className={`w-full text-left px-4 py-3 border-b border-surface-border/60 hover:bg-white/5 transition-colors ${
                      n.read ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[#f97316] mt-1.5 shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{n.title}</p>
                        <p className="text-xs text-white/50 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-white/30 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
