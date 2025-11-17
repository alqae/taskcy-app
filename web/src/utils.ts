import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

import type { ApiResponse } from '@types'
import i18n from '@/i18n'

export const textOn = (hex: string): '#000000' | '#FFFFFF' => {
  const clean = hex.replace(/^#/, '').toLowerCase()

  const expand = (s: string) =>
    s.length === 3 || s.length === 4
      ? s.split('').map(c => c + c).join('')
      : s

  const h = expand(clean)
  if (![6, 8].includes(h.length)) {
    return '#000000'
  }

  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1

  const rb = Math.round(r * a + 255 * (1 - a))
  const gb = Math.round(g * a + 255 * (1 - a))
  const bb = Math.round(b * a + 255 * (1 - a))

  const toLinear = (c: number) => {
    const cs = c / 255
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4)
  }

  const L = 0.2126 * toLinear(rb) + 0.7152 * toLinear(gb) + 0.0722 * toLinear(bb)

  const contrast = (L1: number, L2: number) =>
    (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)

  const blackL = 0
  const whiteL = 1

  const cBlack = contrast(L, blackL)
  const cWhite = contrast(L, whiteL)

  return cBlack >= cWhite ? '#000000' : '#FFFFFF'
}

export const getCookie = (name: string) => {
  if (typeof document === 'undefined') return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue || undefined
  }
  return undefined
}

export const handleError = (error?: FetchBaseQueryError | SerializedError | Error | unknown): string => {
  if (error && typeof error === 'object') {
    if ('error' in error) {
      return handleError(error.error as FetchBaseQueryError | SerializedError | Error)
    } else if ('status' in error && 'data' in error) {
      if (error.data != null && 'message' in (error.data as ApiResponse<void>)) {
        return i18n.t(`errors.${(error.data as ApiResponse<void>).message}`)
      } else {
        return i18n.t('common.error')
      }
    } else if ('message' in error) {
      return i18n.t(`errors.${(error as Error).message}`)
    }
  } else if (error && typeof error === 'string') {
    return error
  }

  return ''
}

export const formatCurrency = (
  value: number | string,
  currency = 'COP',
  locale = 'es-CO',
  minDigits = 0,
  maxDigits = 2,
): string => {
  const amount = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(amount)) return ''

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  }).format(amount)
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
