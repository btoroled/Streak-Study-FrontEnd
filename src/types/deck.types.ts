export interface CreateDeckRequest {
  name: string
  description?: string
}

export interface UpdateDeckRequest {
  name?: string
  description?: string
}

export interface DeckResponse {
  id: number
  institutionId: number
  name: string
  description: string
  createdAt: string
}
