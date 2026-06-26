import { AlertCircle } from 'lucide-react'
import { getErrorMessage } from '@/lib/error.utils'
import { Button } from '../ui/button'

interface ApiErrorDisplayProps {
  error: unknown
  onRetry?: () => void
}

export default function ApiErrorDisplay({ error, onRetry }: ApiErrorDisplayProps) {
  const message = getErrorMessage(error, 'No se pudo cargar la información.')

  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="w-12 h-12 rounded-full bg-[#ef4444]/10 flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-error" />
      </div>
      <p className="text-sm text-text-secondary max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Intentar de nuevo
        </Button>
      )}
    </div>
  )
}
