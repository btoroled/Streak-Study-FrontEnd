import { useNavigate } from 'react-router-dom'
import { Flame } from 'lucide-react'
import HeroSection from '@/shared/landing/HeroSection'
import HowItWorksSection from '@/shared/landing/HowItWorksSection'
import AiSection from '@/shared/landing/AiSection'
import FlashcardsSection from '@/shared/landing/FlashcardsSection'
import GamificationSection from '@/shared/landing/GamificationSection'
import InstitutionsSection from '@/shared/landing/InstitutionsSection'
import FooterSection from '@/shared/landing/FooterSection'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-base flex flex-col">
      <header className="w-full max-w-4xl mx-auto px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-purple flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-text-primary">StreakStudy</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          Iniciar sesión
        </button>
      </header>

      <HeroSection />

      <HowItWorksSection />

      <section className="w-full max-w-4xl mx-auto px-6 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AiSection />
          <FlashcardsSection />
          <GamificationSection />
        </div>
      </section>

      <InstitutionsSection />

      <div className="mt-auto">
        <FooterSection />
      </div>
    </div>
  )
}
