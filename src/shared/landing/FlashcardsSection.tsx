import FeatureRow from './_FeatureRow'
import mascotReading from '@/assets/brand/mascot-reading.png'

export default function FlashcardsSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <FeatureRow
        eyebrow="Repaso espaciado real"
        title="Estudia solo lo que toca hoy"
        image={mascotReading}
        imageAlt="Mascota estudiando"
        reverse
      >
        <p>
          Usamos el algoritmo SM-2: cada tarjeta se reprograma según qué tan bien
          la recuerdas. Nada de releer todo — solo lo que está por olvidarse.
        </p>
        <p>Menos tiempo de estudio, más retención en el examen.</p>
      </FeatureRow>
    </section>
  )
}
