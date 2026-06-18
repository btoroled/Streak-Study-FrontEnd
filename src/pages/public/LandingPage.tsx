import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import mascotWave from '@/assets/brand/mascot-wave.png'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          {/* Mascota héroe */}
          <div className="relative flex justify-center">
            <div
              className="absolute inset-0 m-auto w-48 h-48 rounded-full blur-3xl opacity-30"
              style={{ background: 'radial-gradient(circle, #f97316 0%, #7c3aed 70%, transparent 100%)' }}
            />
            <img
              src={mascotWave}
              alt="Mascota StreakStudy"
              className="relative w-44 h-44 object-contain drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]"
            />
          </div>
          <h1 className="text-3xl font-black text-white">
            Streak
            <span className="bg-gradient-to-r from-[#f97316] to-[#7c3aed] bg-clip-text text-transparent">
              Study
            </span>
          </h1>
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
