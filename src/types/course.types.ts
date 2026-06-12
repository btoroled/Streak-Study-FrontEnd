export interface CreateCourseRequest {
  name: string
  description?: string
}

export interface CourseResponse {
  id: number
  institutionId: number
  name: string
  description: string
  createdAt: string
}
