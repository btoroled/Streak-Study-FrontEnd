import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { coursesService } from '@/services/courses.service'
import { QK } from '@/lib/query-keys'
import { getErrorMessage } from '@/lib/error.utils'

export function useRoster(courseId: number) {
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: QK.courseRoster(courseId),
    queryFn: () => coursesService.roster(courseId),
  })

  const importCsv = useMutation({
    mutationFn: (file: File) => coursesService.importStudentsCsv(courseId, file),
    onSuccess: (results) => {
      qc.invalidateQueries({ queryKey: QK.courseRoster(courseId) })
      qc.invalidateQueries({ queryKey: QK.courses })
      const created = results.filter(r => r.status === 'created').length
      const failed = results.length - created
      if (failed === 0) toast.success(`${created} alumno${created !== 1 ? 's' : ''} importado${created !== 1 ? 's' : ''}`)
      else toast.warning(`${created} importados, ${failed} con error`)
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  return { ...query, importCsv }
}
