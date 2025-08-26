import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { User, type LoginRequest, type RegisterRequest } from '@types'

type AuthContextType = {
  user: User | null
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
  const API_URL = import.meta.env.VITE_API_URL
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(
    null
    // new User({
    //   id: 1,
    //   firstName: 'John',
    //   lastName: "Doe",
    //   email: "john.doe@example.com",
    //   tokenVersion: 0,
    // })
  )

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
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout request failed')
      }
    } catch (error) {
      // TODO: Show error message
      return Promise.reject(error)
    } finally {
      setUser(null)
      setIsLoading(false)
      localStorage.removeItem('access_token')
    }
  }, [API_URL])

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
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
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
      logout()
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }, [API_URL, logout])

  const getAccessToken = useCallback(() => {
    const item = localStorage.getItem('access_token')
    return item ? item : null
  }, [])

  useEffect(() => {
    const accessToken = getAccessToken()
    if (accessToken) {
      refreshToken()
    }
  }, [getAccessToken, refreshToken])

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: Boolean(user),
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
