import { Upload, Sparkles, Flame } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Sube tus apuntes',
    desc: 'Un PDF de clase, un resumen o tus propios apuntes.',
  },
  {
    icon: Sparkles,
    title: 'La IA genera tus flashcards',
    desc: 'Preguntas y respuestas listas para estudiar, sin escribir nada a mano.',
  },
  {
    icon: Flame,
    title: 'Estudia y mantén tu racha',
    desc: 'Repetición espaciada (SM-2), XP, niveles y racha diaria te hacen volver.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-14">
      <h2 className="text-2xl font-bold text-text-primary text-center mb-2">Cómo funciona</h2>
      <p className="text-sm text-text-secondary text-center mb-10">Tres pasos, sin fricción.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {steps.map(({ icon: Icon, title, desc }, i) => (
          <div key={title} className="relative bg-surface-card border border-surface-border rounded-xl p-5">
            <span className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-gradient-to-br from-brand-orange to-brand-purple text-white text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <Icon className="w-6 h-6 text-brand-orange mb-3" />
            <p className="text-sm font-semibold text-text-primary mb-1">{title}</p>
            <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
