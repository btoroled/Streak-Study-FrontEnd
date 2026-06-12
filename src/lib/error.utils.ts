import type { ApiError, ApiErrorCode } from '@/types/api.types'
import axios from 'axios'

export function extractApiError(error: unknown): ApiError | null {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data as ApiError
  }
  return null
}

export function getErrorCode(error: unknown): ApiErrorCode | null {
  return (extractApiError(error)?.error as ApiErrorCode) ?? null
}

export function getErrorMessage(error: unknown, fallback = 'Algo salió mal, intenta de nuevo.'): string {
  const apiErr = extractApiError(error)
  return apiErr?.message ?? fallback
}
