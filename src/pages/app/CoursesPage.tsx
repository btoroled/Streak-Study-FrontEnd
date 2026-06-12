import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import CourseTable from '@/features/courses/components/CourseTable'
import CourseForm from '@/features/courses/components/CourseForm'
import CourseDeleteDialog from '@/features/courses/components/CourseDeleteDialog'
import ApiErrorDisplay from '@/shared/components/feedback/ApiErrorDisplay'
import RoleGuard from '@/shared/components/guards/RoleGuard'
import { Button } from '@/shared/components/ui/button'
import { useCourses } from '@/features/courses/hooks/useCourses'
import type { CourseResponse } from '@/types/course.types'
import type { CourseFormValues } from '@/features/courses/schemas/course.schemas'

export default function CoursesPage() {
  const { data: courses = [], isLoading, error, refetch, createCourse, deleteCourse } = useCourses()
  const [showCreate, setShowCreate] = useState(false)
  const [deleting, setDeleting] = useState<CourseResponse | null>(null)

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-white/5 rounded-lg animate-pulse" />
        <div className="h-48 rounded-xl bg-white/5 animate-pulse" />
      </div>
    )
  }

  if (error) return <ApiErrorDisplay error={error} onRetry={() => refetch()} />

  const handleCreate = async (values: CourseFormValues) => {
    await createCourse.mutateAsync(values)
    setShowCreate(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Cursos</h1>
          <p className="text-sm text-white/50 mt-0.5">{courses.length} curso{courses.length !== 1 ? 's' : ''}</p>
        </div>
        <RoleGuard permission="create:course">
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-1" /> Nuevo curso
          </Button>
        </RoleGuard>
      </div>

      <CourseTable
        courses={courses}
        canDelete={true}
        onDelete={setDeleting}
      />

      <AnimatePresence>
        {showCreate && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
            <motion.div className="relative z-10 w-full max-w-md bg-[#16171f] border border-white/10 rounded-2xl p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">Nuevo curso</h2>
                <button className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors"
                  onClick={() => setShowCreate(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CourseForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} isLoading={createCourse.isPending} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleting && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleting(null)} />
            <motion.div className="relative z-10 w-full max-w-md bg-[#16171f] border border-white/10 rounded-2xl p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}>
              <CourseDeleteDialog
                course={deleting}
                onConfirm={() => deleteCourse.mutateAsync(deleting.id).then(() => setDeleting(null))}
                onCancel={() => setDeleting(null)}
                isLoading={deleteCourse.isPending}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
