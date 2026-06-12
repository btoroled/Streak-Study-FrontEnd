import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'

export default function Error403Page() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm">
        <p className="text-7xl font-black text-white/10">403</p>
        <h1 className="text-xl font-bold text-white">Sin acceso</h1>
        <p className="text-sm text-white/50">No tienes permisos para ver esta página.</p>
        <Button onClick={() => navigate('/dashboard')}>Ir al Dashboard</Button>
      </div>
    </div>
  )
}
