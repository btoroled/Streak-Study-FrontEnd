import { useNavigate } from 'react-router-dom'
import { Layers, Sparkles, Trophy, Flame } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import mascotWave from '@/assets/brand/mascot-wave.png'

const features = [
  { icon: Layers, color: '#f97316', title: 'Flashcards', desc: 'Estudio espaciado' },
  { icon: Sparkles, color: '#a78bfa', title: 'IA desde PDF', desc: 'Genera tarjetas solo' },
  { icon: Trophy, color: '#f9a366', title: 'Ranking', desc: 'Compite y sube' },
]

const stats = [
  { value: '8', label: 'niveles de fénix' },
  { value: 'IA', label: 'resúmenes de PDF' },
  { value: '🔥', label: 'rachas diarias' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center p-6">
      {/* Nav */}
      <header className="w-full max-w-2xl flex items-center justify-between mb-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#7c3aed] flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-text-primary">StreakStudy</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-white/55 hover:text-white transition-colors"
        >
          Iniciar sesión
        </button>
      </header>

      <main className="w-full max-w-2xl text-center">
        {/* Hero */}
        <div className="relative flex justify-center mb-5">
          <div
            className="absolute inset-0 m-auto w-44 h-44 rounded-full blur-3xl opacity-35"
            style={{ background: 'radial-gradient(circle, #f97316 0%, #7c3aed 70%, transparent 100%)' }}
          />
          <img
            src={mascotWave}
            alt="Mascota StreakStudy"
            className="relative w-40 h-40 object-contain drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f97316]/12 mb-4">
          <Flame className="w-3.5 h-3.5 text-[#f97316]" />
          <span className="text-xs text-[#f9a366]">Aprende. Mantén tu racha. Crece.</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight max-w-lg mx-auto mb-3">
          Convierte el estudio diario en un{' '}
          <span className="bg-gradient-to-r from-[#f97316] to-[#7c3aed] bg-clip-text text-transparent">
            hábito que no rompes
          </span>
        </h1>
        <p className="text-base text-white/60 max-w-md mx-auto mb-7 leading-relaxed">
          Flashcards generadas con IA desde tus PDFs, rachas que te motivan y el ranking de tu institución.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Button size="lg" onClick={() => navigate('/register')}>Comenzar gratis</Button>
          <Button size="lg" variant="ghost" onClick={() => navigate('/login')}>Ya tengo cuenta</Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-surface-card border border-white/8 rounded-xl p-4">
              <Icon className="w-6 h-6 mx-auto" style={{ color }} />
              <p className="text-sm font-semibold text-text-primary mt-2.5">{title}</p>
              <p className="text-xs text-white/45 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 pt-6 border-t border-white/7">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-white/45 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
