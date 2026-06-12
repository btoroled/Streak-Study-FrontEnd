import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { deckSchema, type DeckFormValues } from '@/features/decks/schemas/deck.schemas'
import { Button } from '@/shared/components/ui/button'
import type { DeckResponse } from '@/types/deck.types'

interface Props {
  defaultValues?: Partial<DeckResponse>
  onSubmit: (values: DeckFormValues) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function DeckForm({ defaultValues, onSubmit, onCancel, isLoading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<DeckFormValues>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-white/70">Nombre del mazo</label>
        <input
          type="text"
          placeholder="Ej. Biología molecular"
          className="w-full bg-[#1a1b26] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/60"
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-white/70">
          Descripción <span className="text-white/30">(opcional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="¿De qué trata este mazo?"
          className="w-full bg-[#1a1b26] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-orange-500/60 resize-none"
          {...register('description')}
        />
        {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" loading={isLoading} className="flex-1">
          {defaultValues?.id ? 'Guardar cambios' : 'Crear mazo'}
        </Button>
      </div>
    </form>
  )
}
