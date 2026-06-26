import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import mascotThinking from '@/assets/brand/mascot-thinking.png'

/**
 * errorElement de react-router: captura errores de render/carga de las rutas
 * y muestra una pantalla de error con la marca, en vez del overlay por defecto.
 */
export default function RouteErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  const status = isRouteErrorResponse(error) ? error.status : 500
  const detail =
    isRouteErrorResponse(error)
      ? error.statusText
      : error instanceof Error
        ? error.message
        : 'Error inesperado'

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm">
        <img
          src={mascotThinking}
          alt=""
          className="w-24 h-24 object-contain mx-auto drop-shadow-xl animate-[float_4s_ease-in-out_infinite]"
        />
        <p className="text-6xl font-black text-white/10">{status}</p>
        <h1 className="text-xl font-bold text-white">Algo salió mal</h1>
        <p className="text-sm text-white/50">
          Ocurrió un error inesperado. Puedes volver al inicio o recargar la página.
        </p>
        {detail && (
          <p className="text-xs text-white/25 font-mono break-words">{detail}</p>
        )}
        <div className="flex gap-3 justify-center pt-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Recargar
          </Button>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </div>
    </div>
  )
}
