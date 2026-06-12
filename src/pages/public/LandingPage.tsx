import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <div className="text-5xl">🔥</div>
          <h1 className="text-3xl font-black text-white">StreakStudy</h1>
          <p className="text-white/60 text-base">Aprende. Mantén tu racha. Crece.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '📚', label: 'Flashcards' },
            { icon: '🤖', label: 'IA PDF' },
            { icon: '🏆', label: 'Ranking' },
          ].map((f) => (
            <div key={f.label} className="bg-[#16171f] border border-white/8 rounded-xl p-3">
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-xs text-white/50">{f.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button size="lg" onClick={() => navigate('/register')}>Comenzar gratis</Button>
          <Button size="lg" variant="ghost" onClick={() => navigate('/login')}>Ya tengo cuenta</Button>
        </div>
      </div>
    </div>
  )
}
