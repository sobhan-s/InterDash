import { format, parseISO } from 'date-fns'

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMMM do yyyy, h:mm:ss a')
}

export const formatCurrency = (amount: number): string => {
  return '$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

export const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return function executedFunction(...args: unknown[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const deepClone = (obj: unknown): unknown => {
  return JSON.parse(JSON.stringify(obj))
}

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const shuffle = (array: unknown[]): unknown[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const API_BASE = 'https://jsonplaceholder.typicode.com'
export const CRYPTO_API = 'https://api.coingecko.com/api/v3'
export const WEATHER_API = 'https://api.open-meteo.com/v1'
