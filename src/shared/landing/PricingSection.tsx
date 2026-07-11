import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/lib/cn'

interface Tier {
  name: string
  price: string
  period?: string
  desc: string
  features: string[]
  cta: string
  action: 'register' | 'contact'
  highlight?: boolean
}

// Precios placeholder — display-only, sin checkout (decisión W6.3).
const TIERS: Tier[] = [
  {
    name: 'Gratis',
    price: 'S/ 0',
    desc: 'Para empezar a estudiar mejor hoy.',
    features: ['Mazos y flashcards ilimitados', 'Repaso espaciado SM-2', 'Rachas, XP y logros', '3 PDFs con IA al mes'],
    cta: 'Crear cuenta',
    action: 'register',
  },
  {
    name: 'Pro',
    price: 'S/ 15',
    period: '/mes',
    desc: 'Para quien estudia en serio.',
    features: ['Todo lo del plan Gratis', 'PDFs con IA ilimitados', 'Tutor IA en cada fallo', 'Analítica avanzada'],
    cta: 'Empezar Pro',
    action: 'register',
    highlight: true,
  },
  {
    name: 'Aula',
    price: 'S/ 49',
    period: '/mes',
    desc: 'Para profes y su clase.',
    features: ['Hasta 40 estudiantes', 'Gestión de clase y cursos', 'Reportes semanales', 'Ranking del aula'],
    cta: 'Probar Aula',
    action: 'register',
  },
  {
    name: 'Institucional',
    price: 'A medida',
    desc: 'Para colegios y universidades.',
    features: ['Estudiantes ilimitados', 'Multi-sede y dominios de correo', 'Panel de administración', 'Soporte dedicado'],
    cta: 'Contactar ventas',
    action: 'contact',
  },
]

export default function PricingSection() {
  const navigate = useNavigate()

  const handleCta = (tier: Tier) => {
    if (tier.action === 'register') navigate('/register')
    else document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="precios" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-16">
      <h2 className="text-3xl font-black text-text-primary text-center mb-2">Planes para cada etapa</h2>
      <p className="text-sm text-text-secondary text-center mb-10">
        Empieza gratis y crece cuando lo necesites.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              'relative bg-surface-card border rounded-2xl p-5 flex flex-col',
              tier.highlight ? 'border-brand-purple shadow-lg shadow-brand-purple/10' : 'border-surface-border',
            )}
          >
            {tier.highlight && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-brand-purple text-white text-[10px] font-bold uppercase tracking-wide">
                Popular
              </span>
            )}
            <h3 className="text-sm font-bold text-text-primary">{tier.name}</h3>
            <div className="mt-2 mb-1">
              <span className="text-2xl font-black text-text-primary">{tier.price}</span>
              {tier.period && <span className="text-xs text-text-muted">{tier.period}</span>}
            </div>
            <p className="text-xs text-text-secondary mb-4">{tier.desc}</p>
            <ul className="space-y-2 mb-5 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-text-secondary">
                  <Check className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-px" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              size="sm"
              variant={tier.highlight ? 'primary' : 'outline'}
              onClick={() => handleCta(tier)}
              className="w-full"
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
