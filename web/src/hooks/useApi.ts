import { useEffect, useState, useCallback } from 'react'

import { useAuth } from '@/context/AuthContext'
import { handleError } from '@/utils'

type UseApiOptions<R> = {
  skip?: boolean
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  body?: R
  headers?: Record<string, string>
  query?: Record<string, string>
}

export type ApiState<T, R> = {
  data?: T
  error?: string
  isLoading: boolean
  refetch: (options?: UseApiOptions<R>) => Promise<void>
}

export const useApi = <T = unknown, R = unknown>(
  endpoint: string,
  { skip = false, method = "GET", body, headers, query }: UseApiOptions<R> = {}
): ApiState<T, R> => {
  const { getAccessToken } = useAuth()

  const [data, setData] = useState<T>()
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchData = useCallback(async (options?: UseApiOptions<R>) => {
    if (isLoading) return
    setIsLoading(true)
    setError(undefined)

    const requestHeaders: Record<string, string> = {
      ...headers,
      ...options?.headers,
      'Content-Type': "application/json",
    }

    const accessToken = getAccessToken()
    if (accessToken) {
      requestHeaders['Authorization'] = `Bearer ${accessToken}`
    }

    try {
      const URL = `${import.meta.env.VITE_API_URL}${endpoint}`
      const URLWithQuery = `${URL}?${new URLSearchParams(options && options.query ? options.query : query).toString()}`
      const res = await fetch(URLWithQuery, {
        headers: requestHeaders,
        method: options?.method || method,
        body: (options?.method || method) !== "GET" ? JSON.stringify(options?.body || body) : undefined,
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json?.message)
      }

      setData(json as T)
    } catch (error) {
      setError(handleError(error))
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, headers, getAccessToken, endpoint, query, method, body])

  useEffect(() => {
    if (!skip && !isInitialized) {
      setIsInitialized(true)
      fetchData()
    }
  }, [skip, fetchData, isInitialized])

  return {
    data,
    error,
    isLoading,
    refetch: fetchData,
  }
}
