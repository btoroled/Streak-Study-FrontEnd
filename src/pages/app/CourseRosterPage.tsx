import { useParams, Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, Copy, QrCode, Upload, UserPlus, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import ApiErrorDisplay from '@/shared/components/feedback/ApiErrorDisplay'
import EmptyState from '@/shared/components/feedback/EmptyState'
import mascotThinking from '@/assets/brand/mascot-thinking.png'
import { Button } from '@/shared/components/ui/button'
import CreateUserForm from '@/features/team/components/CreateUserForm'
import { coursesService } from '@/services/courses.service'
import { useRoster } from '@/features/courses/hooks/useRoster'
import { useAuthStore } from '@/store/auth.store'
import { QK } from '@/lib/query-keys'

export default function CourseRosterPage() {
  const { id } = useParams<{ id: string }>()
  const courseId = Number(id)
  const institutionId = useAuthStore((s) => s.institutionId)
  const [showManualAlta, setShowManualAlta] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: course, isLoading: isCourseLoading, error: courseError } = useQuery({
    queryKey: QK.course(courseId),
    queryFn: () => coursesService.get(courseId),
  })
  const { data: students = [], isLoading, error, refetch, importCsv } = useRoster(courseId)

  const inviteLink = institutionId
    ? `${window.location.origin}/register?iid=${institutionId}&cid=${courseId}`
    : null

  const copyInviteLink = async () => {
    if (!inviteLink) return
    await navigator.clipboard.writeText(inviteLink)
    toast.success('Link copiado')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await importCsv.mutateAsync(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  if (isLoading || isCourseLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-64 bg-surface-hover rounded-lg animate-pulse" />
        <div className="h-32 rounded-xl bg-surface-hover animate-pulse" />
        <div className="h-48 rounded-xl bg-surface-hover animate-pulse" />
      </div>
    )
  }

  if (error || courseError) return <ApiErrorDisplay error={error ?? courseError} onRetry={() => refetch()} />

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Cursos
        </Link>
        <h1 className="text-xl font-bold text-text-primary">{course?.name ?? 'Curso'}</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          {students.length} alumno{students.length !== 1 ? 's' : ''} inscripto{students.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Invitación por link */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold text-text-primary">Link de invitación</p>
        <p className="text-xs text-text-secondary">
          Compartí este link con tus alumnos: al registrarse quedan inscriptos automáticamente en este curso.
        </p>
        {inviteLink && (
          <>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={inviteLink}
                className="flex-1 px-3 py-2 rounded-lg bg-surface-overlay border border-surface-border text-xs text-text-secondary truncate"
              />
              <Button type="button" size="sm" variant="ghost" onClick={copyInviteLink}>
                <Copy className="w-4 h-4 mr-1" /> Copiar
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setShowQr((v) => !v)}>
                <QrCode className="w-4 h-4 mr-1" /> {showQr ? 'Ocultar QR' : 'Mostrar QR'}
              </Button>
            </div>
            {showQr && (
              <div className="flex justify-center pt-2">
                <div className="p-3 bg-white rounded-xl">
                  <QRCodeSVG value={inviteLink} size={180} marginSize={0} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Alta manual + import CSV */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm font-semibold text-text-primary">Agregar alumnos</p>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowManualAlta(true)}>
              <UserPlus className="w-4 h-4 mr-1" /> Alta manual
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              loading={importCsv.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" /> Importar CSV
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <p className="text-xs text-text-secondary">
          El CSV debe tener columnas <code>fullName,email</code> (con o sin encabezado). Se genera una contraseña
          temporal por alumno — compartila aparte.
        </p>

        {importCsv.data && (
          <div className="border border-surface-border rounded-lg overflow-hidden mt-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-surface-border bg-surface-overlay">
                  <th className="text-left px-3 py-2 text-text-muted">Fila</th>
                  <th className="text-left px-3 py-2 text-text-muted">Email</th>
                  <th className="text-left px-3 py-2 text-text-muted">Estado</th>
                </tr>
              </thead>
              <tbody>
                {importCsv.data.map((r) => (
                  <tr key={r.row} className="border-b border-surface-border last:border-0">
                    <td className="px-3 py-2 text-text-secondary">{r.row}</td>
                    <td className="px-3 py-2 text-text-primary">{r.email}</td>
                    <td className="px-3 py-2">
                      {r.status === 'created' ? (
                        <span className="text-success">Creado</span>
                      ) : (
                        <span className="text-error" title={r.error ?? ''}>Error: {r.error}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Roster */}
      {students.length === 0 ? (
        <EmptyState mascot={mascotThinking} title="Sin alumnos" description="Todavía no hay alumnos inscriptos en este curso" />
      ) : (
        <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wide">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wide">Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.userId} className="border-b border-surface-border last:border-0 hover:bg-surface-hover transition-colors">
                  <td className="px-4 py-3 text-text-primary font-medium">{s.fullName}</td>
                  <td className="px-4 py-3 text-text-secondary">{s.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showManualAlta && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowManualAlta(false)} />
            <motion.div className="relative z-10 w-full max-w-md bg-surface-card border border-surface-border rounded-2xl p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-text-primary">Alta manual</h2>
                <button className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                  onClick={() => setShowManualAlta(false)}
                  aria-label="Cerrar">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CreateUserForm
                lockRoleToStudent
                courseId={courseId}
                onCreated={() => setShowManualAlta(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
