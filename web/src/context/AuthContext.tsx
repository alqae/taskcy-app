import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'

import { User, type LoginRequest, type RegisterRequest } from '@types'
import { getCookie, handleError } from '@/utils'

type AuthContextType = {
  user?: User
  isLoading: boolean
  isLoggedIn: boolean
  login: (user: LoginRequest) => Promise<void>
  register: (user: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { enqueueSnackbar } = useSnackbar()

  const API_URL = import.meta.env.VITE_API_URL
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User>(
    // new User( 1, 'John', 'Doe', 'john.doe@example.com', 0) // FYI: This is just for testing
  )

  const getAccessToken = useCallback(() => {
    const item = localStorage.getItem('access_token')
    return item ? item : null
  }, [])

  const [isLoggedIn, setIsLoggedIn] = useState(() => getAccessToken() !== null)

  const login = async (newUser: LoginRequest) => {
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message)
      }

      const accessToken = response.headers.get('Authorization')
      if (accessToken) {
        localStorage.setItem('access_token', accessToken)
      } else {
        throw new Error('No access token received')
      }

      setUser(data)
      setIsLoggedIn(true)
      enqueueSnackbar('Welcome back!', { variant: 'success' })
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (newUser: RegisterRequest) => {
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data)
      }

      const accessToken = response.headers.get('Authorization')
      if (accessToken) {
        localStorage.setItem('access_token', accessToken)
      } else {
        throw new Error('No access token received')
      }

      setUser(data)
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = useCallback(async () => {
    try {
      setIsLoggedIn(false)
      setIsLoading(true)

      const accessToken = getAccessToken()
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) throw new Error('Logout request failed')
    } finally {
      setUser(undefined)
      setIsLoading(false)
      localStorage.removeItem('access_token')
    }
  }, [API_URL, getAccessToken])

  const refreshToken = useCallback(async () => {
    try {
      const jid = getCookie('jid')
      if (!jid) throw new Error('Your session has expired, please login again')

      setIsLoading(true)

      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Something went wrong')

      const accessToken = response.headers.get('Authorization')
      if (accessToken) {
        localStorage.setItem('access_token', accessToken)
      } else {
        throw new Error('No access token received')
      }

      setUser(data)
    } catch (error) {
      handleError(error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }, [API_URL, logout])

  const fetchProfile = useCallback(async () => {
    setIsLoading(true)

    try {
      const accessToken = getAccessToken()
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Something went wrong')
      setUser(data)
    } catch {
      refreshToken()
    } finally {
      setIsLoading(false)
    }
  }, [API_URL, refreshToken, getAccessToken])

  useEffect(() => {
    if (isLoggedIn && !user) {
      fetchProfile()
    }
  }, [isLoggedIn, user, fetchProfile])

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      isLoading,
      login,
      logout,
      register,
      refreshToken,
      getAccessToken,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
