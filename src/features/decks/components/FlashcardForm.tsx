import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { flashcardSchema, type FlashcardFormValues } from '@/features/decks/schemas/flashcard.schemas'
import { Button } from '@/shared/components/ui/button'
import type { FlashcardResponse } from '@/types/flashcard.types'

interface Props {
  defaultValues?: Partial<FlashcardResponse>
  onSubmit: (values: FlashcardFormValues) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const DIFFICULTIES = [
  { value: 'EASY',   label: 'Fácil' },
  { value: 'MEDIUM', label: 'Medio' },
  { value: 'HARD',   label: 'Difícil' },
] as const

export default function FlashcardForm({ defaultValues, onSubmit, onCancel, isLoading }: Props) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      question: defaultValues?.question ?? '',
      answer: defaultValues?.answer ?? '',
      difficulty: defaultValues?.difficulty ?? 'MEDIUM',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-secondary">Pregunta</label>
        <textarea
          rows={3}
          placeholder="¿Cuál es la función del ribosoma?"
          className="w-full bg-surface-overlay border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500/60 resize-none"
          {...register('question')}
        />
        {errors.question && <p className="text-xs text-red-400">{errors.question.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-secondary">Respuesta</label>
        <textarea
          rows={3}
          placeholder="Síntesis de proteínas a partir de ARNm"
          className="w-full bg-surface-overlay border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-orange-500/60 resize-none"
          {...register('answer')}
        />
        {errors.answer && <p className="text-xs text-red-400">{errors.answer.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-secondary">Dificultad</label>
        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => field.onChange(d.value)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    field.value === d.value
                      ? 'border-orange-500 bg-orange-500/15 text-orange-400'
                      : 'border-surface-border text-text-secondary hover:border-text-muted'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" loading={isLoading} className="flex-1">
          {defaultValues?.id ? 'Guardar cambios' : 'Crear flashcard'}
        </Button>
      </div>
    </form>
  )
}
