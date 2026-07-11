import api from './api.client'
import type {
  CreateCourseRequest,
  CourseResponse,
  RosterStudentResponse,
  CsvImportRowResult,
} from '@/types/course.types'

export const coursesService = {
  list: () => api.get<CourseResponse[]>('/courses').then(r => r.data),
  get: (id: number) => api.get<CourseResponse>(`/courses/${id}`).then(r => r.data),
  create: (data: CreateCourseRequest) => api.post<CourseResponse>('/courses', data).then(r => r.data),
  remove: (id: number) => api.delete(`/courses/${id}`),
  roster: (id: number) => api.get<RosterStudentResponse[]>(`/courses/${id}/students`).then(r => r.data),
  importStudentsCsv: (id: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api
      .post<CsvImportRowResult[]>(`/courses/${id}/students/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(r => r.data)
  },
}
