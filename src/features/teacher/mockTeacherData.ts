import type { TeacherCourseSummary, TeacherCourseMetrics } from '@/types/teacher.types'

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export const MOCK_TEACHER_COURSES: TeacherCourseSummary[] = [
  { id: 1, name: 'Bases de Datos II', code: 'CS2031', studentsCount: 8 },
]

export const MOCK_TEACHER_COURSE_METRICS: Record<number, TeacherCourseMetrics> = {
  1: {
    courseId: 1,
    courseName: 'Bases de Datos II',
    activeStudents7d: 6,
    cardsStudied7d: 342,
    averageAccuracy: 0.81,
    currentStreakAvg: 5,
    weeklyActivity: [6, 5, 4, 3, 2, 1, 0].map((daysBack) => ({
      date: daysAgo(daysBack).slice(0, 10),
      reviews: Math.round(20 + Math.random() * 40),
    })),
    students: [
      { userId: 1, name: 'Ana Torres', lastActivityAt: daysAgo(0), xpWeekly: 420, masteryPercent: 78 },
      { userId: 2, name: 'Bruno Salas', lastActivityAt: daysAgo(0), xpWeekly: 310, masteryPercent: 65 },
      { userId: 3, name: 'Camila Ruiz', lastActivityAt: daysAgo(1), xpWeekly: 280, masteryPercent: 72 },
      { userId: 4, name: 'Diego Vega', lastActivityAt: daysAgo(1), xpWeekly: 190, masteryPercent: 54 },
      { userId: 5, name: 'Elena Paredes', lastActivityAt: daysAgo(2), xpWeekly: 150, masteryPercent: 61 },
      { userId: 6, name: 'Fabio Mendoza', lastActivityAt: daysAgo(3), xpWeekly: 95, masteryPercent: 40 },
      { userId: 7, name: 'Gabriela Ríos', lastActivityAt: daysAgo(6), xpWeekly: 30, masteryPercent: 22 },
      { userId: 8, name: 'Hugo Campos', lastActivityAt: daysAgo(9), xpWeekly: 0, masteryPercent: 15 },
    ],
  },
}
