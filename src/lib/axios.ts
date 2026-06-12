import axios from 'axios'
import { API_BASE_URL } from '@/config/constants'

export const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})
