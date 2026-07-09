import { useMemo, useState } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import Pagination from '@/shared/components/ui/Pagination'
import type { TeacherStudentRow } from '@/types/teacher.types'

const PAGE_SIZE = 5

type SortKey = 'lastActivityAt' | 'xpWeekly' | 'masteryPercent'

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'lastActivityAt', label: 'Última actividad' },
  { key: 'xpWeekly', label: 'XP semanal' },
  { key: 'masteryPercent', label: '% dominio' },
]

const dtf = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' })

export default function StudentsTable({ students }: { students: TeacherStudentRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('xpWeekly')
  const [sortDesc, setSortDesc] = useState(true)
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    const copy = [...students]
    copy.sort((a, b) => {
      const av = sortKey === 'lastActivityAt' ? new Date(a[sortKey]).getTime() : a[sortKey]
      const bv = sortKey === 'lastActivityAt' ? new Date(b[sortKey]).getTime() : b[sortKey]
      return sortDesc ? bv - av : av - bv
    })
    return copy
  }, [students, sortKey, sortDesc])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageRows = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDesc((d) => !d)
    } else {
      setSortKey(key)
      setSortDesc(true)
    }
    setPage(0)
  }

  if (students.length === 0) {
    return <p className="text-sm text-text-muted py-4">Aún no hay alumnos en este curso.</p>
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-text-secondary border-b border-surface-border">
              <th className="py-2 pr-3 font-medium">Alumno</th>
              {COLUMNS.map(({ key, label }) => (
                <th key={key} className="py-2 pr-3 font-medium">
                  <button
                    onClick={() => toggleSort(key)}
                    className="inline-flex items-center gap-1 hover:text-text-primary transition-colors"
                  >
                    {label}
                    {sortKey === key && (sortDesc ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.userId} className="border-b border-surface-border/60 last:border-0">
                <td className="py-2.5 pr-3 text-text-primary font-medium">{row.name}</td>
                <td className="py-2.5 pr-3 text-text-secondary">{dtf.format(new Date(row.lastActivityAt))}</td>
                <td className="py-2.5 pr-3 text-text-secondary">{row.xpWeekly}</td>
                <td className="py-2.5 pr-3 text-text-secondary">{row.masteryPercent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
