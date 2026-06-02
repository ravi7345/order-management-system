import { apiRequest } from './client'

export const customersApi = {
  list: () => apiRequest('/customers'),
  create: (payload) => apiRequest('/customers', { method: 'POST', body: payload }),
  remove: (id) => apiRequest(`/customers/${id}`, { method: 'DELETE' }),
}
