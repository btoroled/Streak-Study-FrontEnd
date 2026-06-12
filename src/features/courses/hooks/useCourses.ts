import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { coursesService } from '@/services/courses.service'
import { QK } from '@/lib/query-keys'
import { getErrorMessage } from '@/lib/error.utils'
import type { CreateCourseRequest } from '@/types/course.types'

export function useCourses() {
  const qc = useQueryClient()
  const query = useQuery({ queryKey: QK.courses, queryFn: coursesService.list })

  const createCourse = useMutation({
    mutationFn: (data: CreateCourseRequest) => coursesService.create(data),
    onSuccess: (c) => { qc.invalidateQueries({ queryKey: QK.courses }); toast.success(`Curso "${c.name}" creado`) },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const deleteCourse = useMutation({
    mutationFn: (id: number) => coursesService.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QK.courses }); toast.success('Curso eliminado') },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  return { ...query, createCourse, deleteCourse }
}
