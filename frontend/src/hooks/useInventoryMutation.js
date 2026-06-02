import { useMutation } from './useMutation'
import { useInventory } from '../context/InventoryContext'
import { useNotification } from '../context/NotificationContext'

/**
 * Mutation hook that auto-refreshes inventory and surfaces toast notifications.
 * @param {(...args: any[]) => Promise<any>} mutationFn
 * @param {string | ((result: any, ...args: any[]) => string)} successMessage
 */
export function useInventoryMutation(mutationFn, successMessage) {
  const { refresh } = useInventory()
  const { notifySuccess, notifyError } = useNotification()

  return useMutation(mutationFn, {
    onSuccess: async (result, ...args) => {
      const message =
        typeof successMessage === 'function' ? successMessage(result, ...args) : successMessage
      notifySuccess(message)
      await refresh()
    },
    onError: (error) => notifyError(error.message),
  })
}
