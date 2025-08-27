import { useEffect, useState, useCallback } from 'react'

import { useAuth } from '@/context/AuthContext'
import { ApiErrorResponse } from '@types'

type UseApiOptions<R> = {
  skip?: boolean
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: R
  headers?: Record<string, string>
}

type ApiState<T> = {
  data: T | null
  error: string | null
  isLoading: boolean
  refetch: () => void
}

export const useApi = <T = unknown, R = unknown>(
  endpoint: string,
  { skip = false, method = "GET", body, headers }: UseApiOptions<R> = {}
): ApiState<T> => {
  const { getAccessToken } = useAuth()

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [trigger, setTrigger] = useState<number>(0)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const requestHeaders: Record<string, string> = {
      ...headers,
      'Content-Type': "application/json",
    }

    const accessToken = getAccessToken()
    if (accessToken) {
      requestHeaders['Authorization'] = `Bearer ${accessToken}`
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: method !== "GET" ? JSON.stringify(body) : undefined,
      })

      if (!res.ok) throw new Error(`Error ${res.status}`)

      const json = (await res.json()) as T
      setData(json)
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof ApiErrorResponse) {
        setError(err.message)
      } else {
        setError("Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }, [headers, getAccessToken, endpoint, method, body])

  useEffect(() => {
    if (!skip) {
      fetchData()
    }
  }, [skip, fetchData, trigger])

  return {
    data,
    error,
    isLoading,
    refetch: () => setTrigger((p) => p + 1),
  }
}
