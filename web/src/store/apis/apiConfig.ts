import { handleError } from '@/utils'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { clearAuth, setAccessToken } from '@store/reducers/authSlice'
import type { RootState } from '@store/store'
import { enqueueSnackbar } from 'notistack'

export const baseUrl = import.meta.env.VITE_API_URL || 'https://api.taskcy.online'

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState
    if (state.auth.accessToken) headers.set('Authorization', `Bearer ${state.auth.accessToken}`)
    return headers
  },
})

export const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error) {
    const { status } = result.error as { status?: number }
    const state = api.getState() as RootState

    if (status === 401) {
      if (state.auth.accessToken) {
        const response = await fetch(`${baseUrl}/auth/refresh-token`, {
          credentials: 'include', // We only need to include refreshToken (jid cookie)
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (response.ok) {
          const { accessToken } = await response.json()
          api.dispatch(setAccessToken(accessToken))
          return rawBaseQuery(args, api, extraOptions)
        }
      }

      api.dispatch(clearAuth())
    } else {
      enqueueSnackbar(handleError(result), { variant: 'error' })
    }

    return result
  }

  return result
}
