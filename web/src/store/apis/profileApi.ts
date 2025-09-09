import { createApi } from '@reduxjs/toolkit/query/react'

import type { UpdateProfileRequest, UpdatePasswordRequest, ApiResponse, User } from '@types'
import { baseQuery } from './apiConfig'
import { setUser } from '@store/reducers/authSlice'

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
      invalidatesTags: ['Profile']
    }),
    updatePassword: builder.mutation<void, UpdatePasswordRequest>({
      query: (body) => ({
        url: '/profile/password',
        method: 'PUT',
        body
      }),
    })
  }),
})

export const {
  useGetProfileQuery,
  useUpdateBasicInformationMutation,
  useUpdatePasswordMutation
} = profileApi
