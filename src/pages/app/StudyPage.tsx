import DeckSelector from '@/features/study/components/DeckSelector'

export default function StudyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Estudiar</h1>
        <p className="text-sm text-text-secondary mt-0.5">Elige un mazo para empezar a repasar</p>
      </div>
      <DeckSelector />
    </div>
  )
}
