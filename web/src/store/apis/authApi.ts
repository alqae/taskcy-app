import { createApi, type FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react'
// import { enqueueSnackbar } from 'notistack'

import { clearAuth, setAccessToken, setUser } from '@/store/reducers/authSlice'
import type { ApiResponse, SignInRequest, SignUpRequest, User } from '@/types'
import type { AppDispatch } from '@/store/store'
import { baseQuery } from './apiConfig'
// import i18n from '@/i18n'

const handleAuthSuccess = (dispatch: AppDispatch, meta?: FetchBaseQueryMeta, data?: ApiResponse<User>) => {
  const headers = meta?.response?.headers

  const accessToken = headers?.get('Authorization')

  if (!accessToken || !data?.data) {
    throw new Error('No access token received')
  }

  dispatch(setAccessToken(accessToken.split(' ')[1]))
  dispatch(setUser(data?.data))

  localStorage.setItem('token', accessToken.split(' ')[1])
}


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    // sendOtp: builder.mutation<ApiResponse, { email: string }>({
    //   query: (body) => ({
    //     url: '/auth/otp/send',
    //     method: 'POST',
    //     body
    //   }),
    //   async onQueryStarted(_, { queryFulfilled }) {
    //     await queryFulfilled
    //     enqueueSnackbar(i18n.t('login.descriptions.code_sended'), { variant: 'success' })
    //   },
    // }),
    // verifyOtp: builder.mutation<ApiResponse<User>, { email: string, code: string, remember_me: boolean }>({
    //   query: (body) => ({
    //     url: '/auth/otp/verify',
    //     method: 'POST',
    //     body
    //   }),
    //   async onQueryStarted(_, { dispatch, queryFulfilled }) {
    //     const { meta, data } = await queryFulfilled
    //     handleAuthTokens(dispatch, meta)
    //     dispatch(setUser(data?.data))
    //   },
    // }),
    // forgotPassword: builder.mutation<ApiResponse, { email: string }>({
    //   query: (body) => ({
    //     url: '/auth/password/forgot',
    //     method: 'POST',
    //     body
    //   }),
    //   async onQueryStarted(_, { queryFulfilled }) {
    //     await queryFulfilled
    //     enqueueSnackbar(i18n.t('forgot_password.messages.code_sended'), { variant: 'success' })
    //   },
    // }),
    // resetPassword: builder.mutation<ApiResponse, { password: string, token: string }>({
    //   query: (body) => ({
    //     url: '/auth/password/reset',
    //     method: 'POST',
    //     body
    //   }),
    //   async onQueryStarted(_, { queryFulfilled }) {
    //     await queryFulfilled
    //     enqueueSnackbar(i18n.t('forgot_password.messages.password_reset'), { variant: 'success' })
    //   },
    // }),
    signIn: builder.mutation<ApiResponse<User>, SignInRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { meta, data } = await queryFulfilled
        handleAuthSuccess(dispatch, meta, data)
      },
    }),
    signUp: builder.mutation<ApiResponse<User>, SignUpRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { meta, data } = await queryFulfilled
        handleAuthSuccess(dispatch, meta, data)
      },
    }),
    signOut: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled
        localStorage.removeItem('token')
        dispatch(clearAuth())
      },
    }),
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: '/auth/profile',
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        dispatch(setUser(data?.data))
      },
    }),
  }),
})

export const {
  // useSendOtpMutation,
  // useVerifyOtpMutation,
  // useForgotPasswordMutation,
  // useResetPasswordMutation,
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
} = authApi
