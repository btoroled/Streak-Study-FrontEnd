import type { components } from './api.generated'

type _Spec = components['schemas']['NotificationResponse']

// Derived from the backend spec (contracts/openapi.json → api.generated.ts).
// Fields use the backend names: body (not message), isRead (not read).
export interface NotificationResponse {
  id: number
  type: string
  title: string
  body: string
  isRead: boolean
  createdAt: string
}

// Exported compile-time guard: becomes `never` if the spec renames any key field, breaking the build.
export type _NotificationSpecGuard =
  Pick<Required<_Spec>, 'id' | 'type' | 'title' | 'body' | 'isRead' | 'createdAt'> extends
  Pick<NotificationResponse, 'id' | 'type' | 'title' | 'body' | 'isRead' | 'createdAt'>
    ? true : never
