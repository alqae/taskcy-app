import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQuery } from './apiConfig'

export const exampleApi = createApi({
  reducerPath: 'exampleApi',
  baseQuery,
  tagTypes: ['Examples'],
  endpoints: (builder) => ({
    getExample: builder.query<object, object[]>({
      query: (params) => ({
        url: '/alerts',
        method: 'GET',
        params
      }),
      providesTags: (_, error) => error ? [] : ['Examples'],
    }),
    createExample: builder.mutation<void, object>({
      query: (body) => ({
        url: '/examples',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Examples']
    })
  }),
})

export const {
  useGetExampleQuery,
  useCreateExampleMutation
} = exampleApi
