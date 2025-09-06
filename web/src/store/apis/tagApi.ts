import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQuery } from './apiConfig'
import type {
  ApiResponse,
  CreateTagRequest,
  Option,
  PaginatedRequest,
  PaginatedResponse,
  Tag
} from '@types'

export const tagApi = createApi({
  reducerPath: 'tagApi',
  baseQuery,
  tagTypes: ['Tags'],
  endpoints: (builder) => ({
    getTagsOptions: builder.query<ApiResponse<Option[]>, void>({
      query: () => ({
        url: '/tags/options',
        method: 'GET',
      }),
      providesTags: (_, error) => error ? [] : ['Tags'],
    }),
    getTags: builder.query<PaginatedResponse<Tag>, PaginatedRequest>({
      query: (params) => ({
        url: '/tags',
        method: 'GET',
        params
      }),
      providesTags: (_, error) => error ? [] : ['Tags'],
    }),
    createTag: builder.mutation<void, CreateTagRequest>({
      query: (body) => ({
        url: '/tags',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Tags']
    }),
    updateTag: builder.mutation<ApiResponse<Tag>, [Tag['id'], CreateTagRequest]>({
      query: ([id, body]) => ({
        url: `/tags/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Tags']
    })
  }),
})

export const {
  useGetTagsOptionsQuery,
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation
} = tagApi
