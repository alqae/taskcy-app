import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch, useSelector } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
// import { thunk } from 'redux-thunk'
import logger from 'redux-logger'

import authSlice, { setAccessToken } from './reducers/authSlice'
import exampleSlice from './reducers/exampleSlice'
import sharedSlice from './reducers/sharedSlice'

import { categoryApi } from './apis/categoryApi'
import { exampleApi } from './apis/exampleApi'
import { authApi } from './apis/authApi'
import { taskApi } from './apis/taskApi'
import { tagApi } from './apis/tagApi'

export const store = configureStore({
  reducer: {
    shared: sharedSlice,
    example: exampleSlice,
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [exampleApi.reducerPath]: exampleApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [tagApi.reducerPath]: tagApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(
        authApi.middleware,
        exampleApi.middleware,
        taskApi.middleware,
        categoryApi.middleware,
        tagApi.middleware,
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

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
