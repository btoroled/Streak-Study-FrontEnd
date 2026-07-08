import api from './api.client'
import type { CreateUserRequest, UserResponse } from '@/types/user.types'

export const usersService = {
  create: (data: CreateUserRequest) =>
    api.post<UserResponse>('/users', data).then(r => r.data),
}
