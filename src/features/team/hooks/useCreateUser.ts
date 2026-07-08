import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService } from '@/services/users.service'
import { getErrorCode, getErrorMessage } from '@/lib/error.utils'

export function useCreateUser() {
  return useMutation({ mutationFn: usersService.create })
}

// Mismo patrón que handleAuthError: errores de campo van al form,
// el resto a toast.
export function handleCreateUserError(
  error: unknown,
  setFieldError?: (field: string, msg: string) => void,
) {
  const code = getErrorCode(error)

  switch (code) {
    case 'email_already_exists':
      setFieldError?.('email', 'Este email ya está registrado')
      break
    case 'validation_error': {
      const apiErr = (
        error as {
          response?: { data?: { errors?: Array<{ field: string; message: string }> } }
        }
      )?.response?.data
      if (apiErr?.errors?.length) {
        apiErr.errors.forEach(({ field, message }) => setFieldError?.(field, message))
      } else {
        toast.error(getErrorMessage(error))
      }
      break
    }
    case 'invalid_role_assignment':
      toast.error('No puedes crear usuarios con ese rol')
      break
    default:
      toast.error(getErrorMessage(error))
  }
}
