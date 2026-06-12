import { Button } from '@/shared/components/ui/button'

interface Props {
  badgeName: string
  badgeIcon: string
  xpCost: number
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function BadgePurchaseDialog({ badgeName, badgeIcon, xpCost, onConfirm, onCancel, isLoading }: Props) {
  return (
    <div className="space-y-4 text-center">
      <div className="text-5xl">{badgeIcon}</div>
      <div>
        <p className="font-semibold text-white">¿Comprar "{badgeName}"?</p>
        <p className="text-sm text-orange-400 mt-1 font-medium">{xpCost} XP</p>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button onClick={onConfirm} loading={isLoading} className="flex-1">Confirmar</Button>
      </div>
    </div>
  )
}
