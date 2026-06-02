import { useMutation } from './useMutation'
import { useNotification } from '../context/NotificationContext'

/**
 * @param {(...args: any[]) => Promise<any>} mutationFn
 * @param {{
 *   successMessage?: string | Function,
 *   updateCache?: (result: any, ...args: any[]) => void,
 * }} options
 */
export function useInventoryMutation(mutationFn, options) {
  const { notifySuccess, notifyError } = useNotification()

  const config =
    typeof options === 'string' ? { successMessage: options } : options

  const { successMessage, updateCache } = config

  return useMutation(mutationFn, {
    onSuccess: async (result, ...args) => {
      const message =
        typeof successMessage === 'function' ? successMessage(result, ...args) : successMessage
      if (message) notifySuccess(message)

      updateCache?.(result, ...args)
    },
    onError: (error) => notifyError(error.message),
  })
}
