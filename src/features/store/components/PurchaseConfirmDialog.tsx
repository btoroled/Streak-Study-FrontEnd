import { Button } from '@/shared/components/ui/button'

interface Props {
  title: string
  description: string
  cost: number
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function PurchaseConfirmDialog({ title, description, cost, onConfirm, onCancel, isLoading }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-white/60 mt-1">{description}</p>
      </div>
      <p className="text-sm text-orange-400 font-medium">Costo: {cost} XP</p>
      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="button" onClick={onConfirm} loading={isLoading} className="flex-1">Confirmar compra</Button>
      </div>
    </div>
  )
}
