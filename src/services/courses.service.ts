import api from './api.client'
import type { CreateCourseRequest, CourseResponse } from '@/types/course.types'

export const coursesService = {
  list: () => api.get<CourseResponse[]>('/courses').then(r => r.data),
  get: (id: number) => api.get<CourseResponse>(`/courses/${id}`).then(r => r.data),
  create: (data: CreateCourseRequest) => api.post<CourseResponse>('/courses', data).then(r => r.data),
  remove: (id: number) => api.delete(`/courses/${id}`),
}
