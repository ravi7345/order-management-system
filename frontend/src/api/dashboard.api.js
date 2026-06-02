import { apiRequest } from './client'

export const dashboardApi = {
  getSummary: () => apiRequest('/dashboard'),
}
