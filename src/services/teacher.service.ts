import api from './api.client'
import type { TeacherCourseSummary, TeacherCourseMetrics, TeacherWeeklyReport } from '@/types/teacher.types'

export const teacherService = {
  listCourses: (signal?: AbortSignal) =>
    api.get<TeacherCourseSummary[]>('/teacher/courses', { signal }).then(r => r.data),
  getCourseMetrics: (courseId: number, signal?: AbortSignal) =>
    api.get<TeacherCourseMetrics>(`/teacher/courses/${courseId}/metrics`, { signal }).then(r => r.data),
  getWeeklyReport: (courseId: number, signal?: AbortSignal) =>
    api.get<TeacherWeeklyReport>(`/teacher/courses/${courseId}/weekly-report`, { signal }).then(r => r.data),
}
