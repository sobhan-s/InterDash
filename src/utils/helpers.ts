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

export const multiplyMatrices = (A: number[][], B: number[][]) => {
  const size = A.length;

  const res = Array.from({ length: size }, () => new Float64Array(size));
  for (let i = 0; i < size; i++)
    for (let k = 0; k < size; k++)
      for (let j = 0; j < size; j++) res[i][j] += A[i][k] * B[k][j];

  return res;
};

export const getDeterminant = (matrix: number[][]): number => {
  const size = matrix.length;

  if (size === 1) return matrix[0][0];

  if (size === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  let determinant = 0;

  for (let i = 0; i < size; i++) {
    const minor = matrix
      .slice(1)
      .map(row => row.filter((_, index) => index !== i));

    const sign = i % 2 === 0 ? 1 : -1;
    determinant += sign * matrix[0][i] * getDeterminant(minor);
  }

  return determinant;
};

export const getStats = (data: number[]) => {
  const sum = data.reduce((a, b) => a + b, 0);

  const mean = sum / data.length;

  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length;

  return { mean, median, variance, std: Math.sqrt(variance) };
};