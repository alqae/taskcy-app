import { createApi } from '@reduxjs/toolkit/query/react'
import { enqueueSnackbar } from 'notistack'

import type { UpdateProfileRequest, UpdatePasswordRequest, ApiResponse, User } from '@types'
import { setUser } from '@store/reducers/authSlice'
import { baseQuery } from './apiConfig'

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery,
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: (_, error) => error ? [] : ['Profile'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        dispatch(setUser(data.data))
      }
    }),
    updateBasicInformation: builder.mutation<void, UpdateProfileRequest>({
      query: (body) => ({
        url: '/profile',
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Profile'],
      async onQueryStarted(_, { queryFulfilled }) {
        await queryFulfilled
        enqueueSnackbar('Profile updated successfully', { variant: 'success' })
      }
    }),
    updatePassword: builder.mutation<void, UpdatePasswordRequest>({
      query: (body) => ({
        url: '/profile/password',
        method: 'PUT',
        body
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await queryFulfilled
        enqueueSnackbar('Password updated successfully', { variant: 'success' })
      }
    })
  }),
})

export const {
  useGetProfileQuery,
  useUpdateBasicInformationMutation,
  useUpdatePasswordMutation
} = profileApi
