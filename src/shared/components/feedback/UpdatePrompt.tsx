import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { toast } from 'sonner'

/**
 * Cuando hay una nueva versión del service worker, muestra un toast con
 * acción explícita para recargar. Evita autoUpdate silencioso, que puede
 * interrumpir una sesión de estudio activa.
 */
export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error: unknown) {
      console.error('SW registration failed', error)
    },
  })

  useEffect(() => {
    if (!needRefresh) return
    toast('Nueva versión disponible', {
      description: 'Recarga para aplicar los cambios.',
      duration: Infinity,
      action: {
        label: 'Recargar',
        onClick: () => updateServiceWorker(true),
      },
      onDismiss: () => setNeedRefresh(false),
    })
  }, [needRefresh, setNeedRefresh, updateServiceWorker])

  return null
}
