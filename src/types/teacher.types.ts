export interface TeacherCourseSummary {
  id: number
  name: string
  code: string
  studentsCount: number
}

export interface TeacherWeeklyActivityPoint {
  date: string
  reviews: number
}

export interface TeacherStudentRow {
  userId: number
  name: string
  lastActivityAt: string
  xpWeekly: number
  masteryPercent: number
}

export interface TeacherCourseMetrics {
  courseId: number
  courseName: string
  activeStudents7d: number
  cardsStudied7d: number
  averageAccuracy: number
  currentStreakAvg: number
  weeklyActivity: TeacherWeeklyActivityPoint[]
  students: TeacherStudentRow[]
}
