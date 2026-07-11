import type { TeacherCourseSummary, TeacherCourseMetrics, TeacherWeeklyReport } from '@/types/teacher.types'

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export const MOCK_TEACHER_COURSES: TeacherCourseSummary[] = [
  {
    id: 1,
    name: 'Bases de Datos II',
    description: 'Curso de bases de datos avanzadas',
    code: 'CS2031',
    ownerId: 1,
    ownerName: 'Prof. Demo',
    studentsCount: 8,
    decksCount: 5,
    enrolled: false,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(1),
  },
]

export const MOCK_TEACHER_COURSE_METRICS: Record<number, TeacherCourseMetrics> = {
  1: {
    courseId: 1,
    courseName: 'Bases de Datos II',
    studentsCount: 8,
    activeStudents7d: 6,
    cardsStudied7d: 342,
    avgAccuracy7d: 0.81,
    topDecks: [
      { deckId: 1, name: 'Normalización', reviews7d: 120 },
      { deckId: 2, name: 'Transacciones ACID', reviews7d: 95 },
      { deckId: 3, name: 'Índices y B-Trees', reviews7d: 60 },
      { deckId: 4, name: 'SQL avanzado', reviews7d: 42 },
      { deckId: 5, name: 'NoSQL vs SQL', reviews7d: 25 },
    ],
    students: [
      { userId: 1, fullName: 'Ana Torres', lastActivity: daysAgo(0), weeklyScore: 42, currentStreak: 12, masteryPercent: 78 },
      { userId: 2, fullName: 'Bruno Salas', lastActivity: daysAgo(0), weeklyScore: 31, currentStreak: 5, masteryPercent: 65 },
      { userId: 3, fullName: 'Camila Ruiz', lastActivity: daysAgo(1), weeklyScore: 28, currentStreak: 8, masteryPercent: 72 },
      { userId: 4, fullName: 'Diego Vega', lastActivity: daysAgo(1), weeklyScore: 19, currentStreak: 3, masteryPercent: 54 },
      { userId: 5, fullName: 'Elena Paredes', lastActivity: daysAgo(2), weeklyScore: 15, currentStreak: 2, masteryPercent: 61 },
      { userId: 6, fullName: 'Fabio Mendoza', lastActivity: daysAgo(3), weeklyScore: 9, currentStreak: 0, masteryPercent: 40 },
      { userId: 7, fullName: 'Gabriela Ríos', lastActivity: daysAgo(6), weeklyScore: 3, currentStreak: 0, masteryPercent: 22 },
      { userId: 8, fullName: 'Hugo Campos', lastActivity: daysAgo(9), weeklyScore: 0, currentStreak: 0, masteryPercent: 15 },
    ],
  },
}

export const MOCK_TEACHER_WEEKLY_REPORT: Record<number, TeacherWeeklyReport> = {
  1: {
    courseId: 1,
    weekStart: daysAgo(6),
    weekEnd: daysAgo(0),
    totals: { reviews: 147, activeStudents: 6, accuracy: 0.81 },
    previousWeek: { reviews: 118, activeStudents: 5, accuracy: 0.76 },
    students: [
      { userId: 1, fullName: 'Ana Torres', reviews7d: 42, reviewsPrevWeek: 35, lastActivity: daysAgo(0), atRisk: false },
      { userId: 2, fullName: 'Bruno Salas', reviews7d: 31, reviewsPrevWeek: 28, lastActivity: daysAgo(0), atRisk: false },
      { userId: 3, fullName: 'Camila Ruiz', reviews7d: 28, reviewsPrevWeek: 20, lastActivity: daysAgo(1), atRisk: false },
      { userId: 4, fullName: 'Diego Vega', reviews7d: 19, reviewsPrevWeek: 15, lastActivity: daysAgo(1), atRisk: false },
      { userId: 5, fullName: 'Elena Paredes', reviews7d: 15, reviewsPrevWeek: 12, lastActivity: daysAgo(2), atRisk: false },
      { userId: 6, fullName: 'Fabio Mendoza', reviews7d: 9, reviewsPrevWeek: 8, lastActivity: daysAgo(3), atRisk: false },
      { userId: 7, fullName: 'Gabriela Ríos', reviews7d: 3, reviewsPrevWeek: 0, lastActivity: daysAgo(6), atRisk: true },
      { userId: 8, fullName: 'Hugo Campos', reviews7d: 0, reviewsPrevWeek: 0, lastActivity: daysAgo(9), atRisk: true },
    ],
    summary: 'El curso mostró una mejora esta semana: 147 repasos frente a 118 la semana anterior y la precisión subió de 76% a 81%. Ana Torres y Bruno Salas lideran en constancia. Gabriela Ríos y Hugo Campos llevan varios días sin actividad — conviene un recordatorio antes de que se atrasen más.',
  },
}
