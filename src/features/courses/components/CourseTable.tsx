import { Trash2, BookOpen } from 'lucide-react'
import EmptyState from '@/shared/components/feedback/EmptyState'
import type { CourseResponse } from '@/types/course.types'

interface Props {
  courses: CourseResponse[]
  canDelete?: boolean
  onDelete?: (course: CourseResponse) => void
}

export default function CourseTable({ courses, canDelete, onDelete }: Props) {
  if (courses.length === 0) {
    return <EmptyState icon={BookOpen} title="Sin cursos" description="No hay cursos disponibles aún" />
  }

  return (
    <div className="bg-[#16171f] border border-white/8 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/8">
            <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wide">Nombre</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wide hidden sm:table-cell">Descripción</th>
            {canDelete && <th className="px-4 py-3 w-12" />}
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
              <td className="px-4 py-3 text-white font-medium">{c.name}</td>
              <td className="px-4 py-3 text-white/50 hidden sm:table-cell">{c.description || '—'}</td>
              {canDelete && (
                <td className="px-4 py-3">
                  <button
                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/8 transition-colors"
                    onClick={() => onDelete?.(c)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
