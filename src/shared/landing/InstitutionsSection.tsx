import { GraduationCap, BarChart3, Users } from 'lucide-react'

const points = [
  { icon: Users, text: 'Cursos y alumnos organizados por institución' },
  { icon: BarChart3, text: 'Panel para profesores: actividad, precisión y racha de cada alumno' },
  { icon: GraduationCap, text: 'Licencia institucional — un plan por colegio o universidad' },
]

export default function InstitutionsSection() {
  return (
    <section className="w-full bg-surface-card border-y border-surface-border">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-purple/12 mb-4">
          <GraduationCap className="w-3.5 h-3.5 text-brand-purple-light" />
          <span className="text-xs text-brand-purple-light">Para instituciones</span>
        </div>

        <h2 className="text-2xl font-bold text-text-primary mb-2 max-w-md">
          Lleva StreakStudy a todo tu colegio o universidad
        </h2>
        <p className="text-sm text-text-secondary max-w-lg mb-8 leading-relaxed">
          Tus profesores ven en un solo lugar cómo avanza cada curso; tus alumnos estudian con la misma app que ya conocen.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {points.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-2.5">
              <Icon className="w-4 h-4 text-brand-purple-light shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <a
          href="mailto:hola@streakstudy.app"
          className="inline-block mt-8 text-sm text-brand-orange-light hover:text-brand-orange transition-colors"
        >
          Hablemos de tu institución →
        </a>
      </div>
    </section>
  )
}
