import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { contactSchema, type ContactFormValues } from './contact.schema'

// Endpoint externo (Formspree o similar) — sin backend propio a propósito
// (decisión W6.2). Si no está configurado, caemos a un mailto:.
const CONTACT_FORM_URL: string | undefined = import.meta.env.VITE_CONTACT_FORM_URL
const CONTACT_EMAIL = 'hola@streakstudy.app'

export default function ContactSection() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data: ContactFormValues) => {
    if (!CONTACT_FORM_URL) {
      const subject = encodeURIComponent(`Contacto StreakStudy — ${data.institution ?? data.name}`)
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`)
      window.location.assign(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`)
      return
    }
    try {
      const res = await fetch(CONTACT_FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSent(true)
    } catch {
      toast.error('No se pudo enviar el mensaje. Intenta de nuevo.')
    }
  }

  return (
    <section id="contacto" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-16">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-black text-text-primary text-center mb-2">Hablemos</h2>
        <p className="text-sm text-text-secondary text-center mb-8">
          ¿Quieres llevar StreakStudy a tu institución o tienes alguna duda? Escríbenos.
        </p>

        {sent ? (
          <div className="text-center space-y-3 py-10 bg-surface-card border border-surface-border rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-success mx-auto" />
            <p className="text-sm font-semibold text-text-primary">¡Mensaje enviado!</p>
            <p className="text-xs text-text-secondary">Te responderemos pronto.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Input placeholder="Tu nombre" error={!!errors.name} {...register('name')} />
                {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Input type="email" placeholder="tu@correo.com" error={!!errors.email} {...register('email')} />
                {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
              </div>
            </div>
            <Input placeholder="Institución (opcional)" {...register('institution')} />
            <div className="space-y-1.5">
              <textarea
                rows={4}
                placeholder="¿En qué te podemos ayudar?"
                className={`w-full px-4 py-3 rounded-lg text-sm bg-surface-overlay border text-text-primary placeholder-[#5e5c70] focus:outline-none focus:ring-2 transition-colors resize-none ${
                  errors.message
                    ? 'border-error focus:ring-error/30'
                    : 'border-surface-border focus:border-brand-purple focus:ring-brand-purple/30'
                }`}
                {...register('message')}
              />
              {errors.message && <p className="text-xs text-error">{errors.message.message}</p>}
            </div>
            <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
              <Send className="w-4 h-4 mr-1.5" />
              Enviar mensaje
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
