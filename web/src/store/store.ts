import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch, useSelector } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
// import { thunk } from 'redux-thunk'
import logger from 'redux-logger'

import authSlice, { setAccessToken } from './reducers/authSlice'
import exampleSlice from './reducers/exampleSlice'
import sharedSlice from './reducers/sharedSlice'

import { exampleApi } from './apis/exampleApi'
import { authApi } from './apis/authApi'

export const store = configureStore({
  reducer: {
    shared: sharedSlice,
    example: exampleSlice,
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [exampleApi.reducerPath]: exampleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(
        authApi.middleware,
        exampleApi.middleware,
        // thunk,
        ...(import.meta.env.DEV ? [logger] : [])
      ),
})

setupListeners(store.dispatch)

// Load user from localStorage
const token = localStorage.getItem("token")
if (token) {
  store.dispatch(setAccessToken(token))
  store.dispatch(authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true }))
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector<RootState>
export const useAppDispatch = useDispatch<AppDispatch>
