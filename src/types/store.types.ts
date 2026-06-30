export interface RewardItemResponse {
  id: number
  title: string
  description: string
  costInPoints: number
  stock: number
}

export interface StoreItemResponse {
  key: string
  name: string
  description: string
  priceXp: number
  owned: number
  maxOwned: number
}
