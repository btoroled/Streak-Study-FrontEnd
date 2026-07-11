import { FileUp, Sparkles, Flame } from 'lucide-react'

const STEPS = [
  {
    icon: FileUp,
    title: '1. Sube tu PDF',
    desc: 'Apuntes de clase, diapositivas o el capítulo del libro — lo que tengas.',
  },
  {
    icon: Sparkles,
    title: '2. La IA crea tus flashcards',
    desc: 'Extraemos el contenido y generamos tarjetas de estudio en segundos.',
  },
  {
    icon: Flame,
    title: '3. Estudia y mantén la racha',
    desc: 'El repaso espaciado te dice qué estudiar hoy. Cada día suma XP y racha.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-16">
      <h2 className="text-3xl font-black text-text-primary text-center mb-10">Cómo funciona</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {STEPS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-surface-card border border-surface-border rounded-2xl p-6 text-center">
            <div className="w-11 h-11 rounded-xl bg-brand-purple/15 flex items-center justify-center mx-auto mb-4">
              <Icon className="w-5 h-5 text-brand-purple" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1.5">{title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
