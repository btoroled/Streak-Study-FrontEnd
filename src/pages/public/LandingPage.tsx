import HeroSection from '@/shared/landing/HeroSection'
import HowItWorksSection from '@/shared/landing/HowItWorksSection'
import AiSection from '@/shared/landing/AiSection'
import FlashcardsSection from '@/shared/landing/FlashcardsSection'
import GamificationSection from '@/shared/landing/GamificationSection'
import PricingSection from '@/shared/landing/PricingSection'
import FaqSection from '@/shared/landing/FaqSection'
import ContactSection from '@/shared/landing/ContactSection'
import FooterSection from '@/shared/landing/FooterSection'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-base scroll-smooth">
      <HeroSection />
      <HowItWorksSection />
      <AiSection />
      <FlashcardsSection />
      <GamificationSection />
      <PricingSection />
      <FaqSection />
      <ContactSection />
      <FooterSection />
    </div>
  )
}
