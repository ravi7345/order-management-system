import { buildQuery } from '../utils/buildQuery'
import { apiRequest } from './client'

export const productsApi = {
  list: ({ page = 1, page_size = 10 } = {}) =>
    apiRequest(`/products${buildQuery({ page, page_size })}`),
  create: (payload) => apiRequest('/products', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/products/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
}
