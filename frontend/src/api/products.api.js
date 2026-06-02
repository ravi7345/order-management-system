import { apiRequest } from './client'

export const productsApi = {
  list: () => apiRequest('/products'),
  create: (payload) => apiRequest('/products', { method: 'POST', body: payload }),
  update: (id, payload) => apiRequest(`/products/${id}`, { method: 'PUT', body: payload }),
  remove: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
}
