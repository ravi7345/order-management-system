/**
 * Builds a compact page list with ellipsis, e.g. [1, '…', 4, 5, 6, '…', 12]
 */
export function getPageNumbers(current, total) {
  if (total <= 1) return [1]
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const pages = new Set([1, total, current, current - 1, current + 1])
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)

  const result = []
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push('…')
    }
    result.push(page)
  })

  return result
}
