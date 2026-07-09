import type { TeacherCourseSummary, TeacherCourseMetrics } from '@/types/teacher.types'

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
