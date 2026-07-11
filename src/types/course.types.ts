export interface CreateCourseRequest {
  name: string
  description?: string
}

export interface CourseResponse {
  id: number
  name: string
  description: string
  code: string
  ownerId: number | null
  ownerName: string | null
  studentsCount: number
  decksCount: number
  enrolled: boolean
  createdAt: string
  updatedAt: string
}

// Roster de un curso (Issue B.14/W7.1).
export interface RosterStudentResponse {
  userId: number
  fullName: string
  email: string
}

export interface CsvImportRowResult {
  row: number
  status: 'created' | 'error'
  email: string
  error: string | null
}
