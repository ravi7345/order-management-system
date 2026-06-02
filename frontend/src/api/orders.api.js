import { buildQuery } from '../utils/buildQuery'
import { apiRequest } from './client'

export const ordersApi = {
  list: ({ page = 1, page_size = 10 } = {}) =>
    apiRequest(`/orders${buildQuery({ page, page_size })}`),
  create: (payload) => apiRequest('/orders', { method: 'POST', body: payload }),
  remove: (id) => apiRequest(`/orders/${id}`, { method: 'DELETE' }),
}
