import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'

export default function Error500Page() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm">
        <p className="text-7xl font-black text-white/10">500</p>
        <h1 className="text-xl font-bold text-white">Error del servidor</h1>
        <p className="text-sm text-white/50">Algo salió mal. Por favor intenta de nuevo.</p>
        <Button onClick={() => navigate('/')}>Volver al inicio</Button>
      </div>
    </div>
  )
}
