export interface TeacherCourseSummary {
  id: number
  name: string
  description: string
  code: string
  ownerId: number
  ownerName: string | null
  studentsCount: number
  decksCount: number
  enrolled: boolean
  createdAt: string
  updatedAt: string
}

export interface TeacherTopDeck {
  deckId: number
  name: string
  reviews7d: number
}

export interface TeacherStudentMetrics {
  userId: number
  fullName: string
  lastActivity: string | null
  weeklyScore: number
  currentStreak: number
  masteryPercent: number
}

export interface TeacherCourseMetrics {
  courseId: number
  courseName: string
  studentsCount: number
  activeStudents7d: number
  cardsStudied7d: number
  avgAccuracy7d: number
  topDecks: TeacherTopDeck[]
  students: TeacherStudentMetrics[]
}

export interface TeacherWeeklyTotals {
  reviews: number
  activeStudents: number
  accuracy: number
}

export interface TeacherWeeklyStudentRow {
  userId: number
  fullName: string
  reviews7d: number
  reviewsPrevWeek: number
  lastActivity: string | null
  atRisk: boolean
}

export interface TeacherWeeklyReport {
  courseId: number
  weekStart: string
  weekEnd: string
  totals: TeacherWeeklyTotals
  previousWeek: TeacherWeeklyTotals
  students: TeacherWeeklyStudentRow[]
  summary: string | null
}
