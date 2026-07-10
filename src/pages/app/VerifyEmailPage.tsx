import PageHeader from '@/shared/components/layout/PageHeader'
import SectionCard from '@/shared/components/layout/SectionCard'
import VerifyEmailForm from '@/features/auth/components/VerifyEmailForm'

export default function VerifyEmailPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Verificación de correo" />
      <SectionCard>
        <VerifyEmailForm />
      </SectionCard>
    </div>
  )
}
