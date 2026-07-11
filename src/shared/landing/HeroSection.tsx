import { useNavigate } from 'react-router-dom'
import { Flame, Building2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import logoMark from '@/assets/brand/logo-mark.png'
import mascotWave from '@/assets/brand/mascot-wave.png'

const NAV_LINKS = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#precios', label: 'Precios' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contacto', label: 'Contacto' },
]

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <header className="relative overflow-hidden">
      {/* Navbar */}
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-2.5">
          <img src={logoMark} alt="StreakStudy" className="w-8 h-8 object-contain" />
          <span className="text-base font-bold text-text-primary">StreakStudy</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Iniciar sesión
          </button>
          <Button size="sm" onClick={() => navigate('/register')}>Empieza gratis</Button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-20 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-orange/10 mb-5">
            <Flame className="w-3.5 h-3.5 text-brand-orange" />
            <span className="text-xs font-medium text-brand-orange">Aprende. Mantén tu racha. Crece.</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary leading-tight mb-4">
            El hábito de estudio que{' '}
            <span className="bg-linear-to-r from-brand-orange to-brand-purple bg-clip-text text-transparent">
              no se rompe
            </span>
          </h1>
          <p className="text-base text-text-secondary max-w-md mx-auto md:mx-0 mb-8 leading-relaxed">
            Flashcards con IA desde tus PDFs, respuestas por voz, repaso espaciado que
            funciona y rachas que convierten estudiar en un juego. Para estudiantes,
            profes e instituciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button size="lg" onClick={() => navigate('/register')}>Empieza gratis</Button>
            <Button size="lg" variant="ghost" onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>
              <Building2 className="w-4 h-4 mr-1.5" />
              Para instituciones
            </Button>
          </div>
        </div>

        <div className="relative flex justify-center flex-1">
          <div
            className="absolute inset-0 m-auto w-56 h-56 rounded-full blur-3xl opacity-35"
            style={{ background: 'radial-gradient(circle, var(--color-brand-orange) 0%, var(--color-brand-purple) 70%, transparent 100%)' }}
          />
          <img
            src={mascotWave}
            alt="Mascota StreakStudy"
            className="relative w-56 h-56 object-contain drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]"
          />
        </div>
      </div>
    </header>
  )
}
