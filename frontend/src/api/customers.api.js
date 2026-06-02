import { buildQuery } from '../utils/buildQuery'
import { apiRequest } from './client'

export const customersApi = {
  list: ({ page = 1, page_size = 10 } = {}) =>
    apiRequest(`/customers${buildQuery({ page, page_size })}`),
  create: (payload) => apiRequest('/customers', { method: 'POST', body: payload }),
  remove: (id) => apiRequest(`/customers/${id}`, { method: 'DELETE' }),
}
