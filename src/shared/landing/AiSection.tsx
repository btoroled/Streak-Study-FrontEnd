import FeatureRow from './_FeatureRow'
import mascotThinking from '@/assets/brand/mascot-thinking.png'

export default function AiSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <FeatureRow
        eyebrow="IA que estudia contigo"
        title="De PDF a flashcards en un click"
        image={mascotThinking}
        imageAlt="Mascota pensando"
      >
        <p>
          Sube tus apuntes y la IA extrae los conceptos clave, los convierte en
          tarjetas de pregunta y respuesta, y las deja en el mazo que elijas.
        </p>
        <p>Y si fallas una tarjeta, el tutor IA te explica el concepto al instante.</p>
      </FeatureRow>
    </section>
  )
}
