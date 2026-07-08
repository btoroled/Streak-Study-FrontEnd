/** Envoltorio de respuesta paginada — mismo contrato que `PageResponse<T>` del backend. */
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  errors?: Array<{ field: string; message: string }>
}

export type ApiErrorCode =
  | 'invalid_password_reset_token'
  | 'validation_error'
  | 'malformed_json'
  | 'bad_request'
  | 'insufficient_xp'
  | 'max_streak_freezes_reached'
  | 'invalid_credentials'
  | 'invalid_refresh_token'
  | 'refresh_token_expired'
  | 'refresh_token_revoked'
  | 'tenant_violation'
  | 'forbidden'
  | 'not_found'
  | 'email_already_exists'
  | 'invalid_role_assignment'
  | 'institution_code_already_exists'
  | 'badge_already_owned'
  | 'password_reset_token_expired'
  | 'too_many_requests'
