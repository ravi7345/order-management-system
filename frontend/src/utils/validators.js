export function isRequired(value) {
  return value !== '' && value !== null && value !== undefined
}

export function isPositiveNumber(value) {
  const num = Number(value)
  return !Number.isNaN(num) && num > 0
}

export function isNonNegativeInteger(value) {
  const num = Number(value)
  return Number.isInteger(num) && num >= 0
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
}
