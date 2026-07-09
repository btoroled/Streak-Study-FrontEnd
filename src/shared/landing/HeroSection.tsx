import { useNavigate } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import mascotWave from '@/assets/brand/mascot-wave.png'

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="w-full max-w-2xl mx-auto text-center px-6 pt-10 pb-16">
      <div className="relative flex justify-center mb-5">
        <div
          className="absolute inset-0 m-auto w-44 h-44 rounded-full blur-3xl opacity-35 bg-gradient-to-br from-brand-orange via-brand-purple to-transparent"
        />
        <img
          src={mascotWave}
          alt="Mascota StreakStudy"
          className="relative w-40 h-40 object-contain drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]"
        />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-orange/12 mb-4">
        <Flame className="w-3.5 h-3.5 text-brand-orange" />
        <span className="text-xs text-brand-orange-light">Aprende. Mantén tu racha. Crece.</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-text-primary leading-tight max-w-lg mx-auto mb-3">
        Convierte el estudio diario en un{' '}
        <span className="bg-gradient-to-r from-brand-orange to-brand-purple bg-clip-text text-transparent">
          hábito que no rompes
        </span>
      </h1>
      <p className="text-base text-text-secondary max-w-md mx-auto mb-7 leading-relaxed">
        Flashcards generadas con IA desde tus PDFs, respuestas por voz, rachas que te motivan y el ranking de tu institución.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" onClick={() => navigate('/register')}>Comenzar gratis</Button>
        <Button size="lg" variant="ghost" onClick={() => navigate('/login')}>Ya tengo cuenta</Button>
      </div>
    </section>
  )
}
