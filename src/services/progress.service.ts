import api from './api.client'
import type { UserProgressResponse, FinishReviewRequest } from '@/types/user.types'

export const progressService = {
  getProgress: () =>
    api.get<UserProgressResponse>('/users/me/progress').then(r => r.data),

  finishReview: (data: FinishReviewRequest) =>
    api.post('/users/me/progress/review', data).then(r => r.data),
}
