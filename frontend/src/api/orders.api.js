import { apiRequest } from './client'

export const ordersApi = {
  list: () => apiRequest('/orders'),
  getById: (id) => apiRequest(`/orders/${id}`),
  create: (payload) => apiRequest('/orders', { method: 'POST', body: payload }),
  remove: (id) => apiRequest(`/orders/${id}`, { method: 'DELETE' }),
}
