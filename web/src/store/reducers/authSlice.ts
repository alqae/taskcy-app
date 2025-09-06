import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '@store/store'
import type { User } from '@types'

interface AuthState {
  accessToken?: string
  user?: User
}

const initialState: AuthState = {
  accessToken: undefined,
  user: undefined,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    clearAuth: (state) => {
      state.accessToken = undefined
      state.user = undefined
    },
  },
})

export const getUserLogged = (state: RootState) => state.auth.user
export const isLoggedIn = (state: RootState) => state.auth.accessToken !== undefined
export const { setAccessToken, setUser, clearAuth } = authSlice.actions
export default authSlice.reducer
