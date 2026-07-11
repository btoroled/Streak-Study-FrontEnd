import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: '¿StreakStudy es gratis?',
    a: 'Sí. El plan Gratis incluye mazos ilimitados, repaso espaciado y gamificación completa. Los planes pagos agregan IA ilimitada y herramientas para profes e instituciones.',
  },
  {
    q: '¿Cómo funciona la generación con IA?',
    a: 'Subes un PDF, extraemos el texto a Markdown y la IA genera flashcards de pregunta/respuesta en el mazo que elijas. Tú siempre puedes editar o borrar las tarjetas.',
  },
  {
    q: '¿Qué es el repaso espaciado?',
    a: 'Un método con evidencia científica (algoritmo SM-2): cada tarjeta se reprograma según qué tan bien la recuerdas, para que repases justo antes de olvidar.',
  },
  {
    q: '¿Qué pasa si pierdo un día de racha?',
    a: 'Puedes canjear protectores de racha con tu XP: cubren automáticamente un día sin estudiar para que no pierdas tu progreso.',
  },
  {
    q: '¿Cómo funciona para instituciones?',
    a: 'Los profes gestionan sus clases y cursos, ven reportes de avance y los estudiantes compiten en el ranking institucional. Escríbenos para una demo.',
  },
]

export default function FaqSection() {
  return (
    <section id="faq" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-16">
      <h2 className="text-3xl font-black text-text-primary text-center mb-10">Preguntas frecuentes</h2>
      <div className="max-w-2xl mx-auto space-y-3">
        {FAQS.map(({ q, a }) => (
          <details key={q} className="group bg-surface-card border border-surface-border rounded-xl">
            <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none text-sm font-semibold text-text-primary">
              {q}
              <ChevronDown className="w-4 h-4 text-text-muted shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
