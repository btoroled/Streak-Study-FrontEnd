import api from './api.client'
import type { TeacherCourseSummary, TeacherCourseMetrics } from '@/types/teacher.types'

export const teacherService = {
  listCourses: (signal?: AbortSignal) =>
    api.get<TeacherCourseSummary[]>('/teacher/courses', { signal }).then(r => r.data),
  getCourseMetrics: (courseId: number, signal?: AbortSignal) =>
    api.get<TeacherCourseMetrics>(`/teacher/courses/${courseId}/metrics`, { signal }).then(r => r.data),
}
