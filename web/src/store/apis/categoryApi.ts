import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQuery } from './apiConfig'
import type {
  ApiResponse,
  Category,
  CreateCategoryRequest,
  GetCategoryRequest,
  Option,
  PaginatedResponse
} from '@types'

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery,
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    getCategoriesOptions: builder.query<ApiResponse<Option[]>, void>({
      query: () => ({
        url: '/categories/options',
        method: 'GET',
      }),
      providesTags: (_, error) => error ? [] : ['Categories'],
    }),
    getCategories: builder.query<PaginatedResponse<Category>, GetCategoryRequest>({
      query: (params) => ({
        url: '/categories',
        method: 'GET',
        params
      }),
      providesTags: (_, error) => error ? [] : ['Categories'],
    }),
    createCategory: builder.mutation<void, CreateCategoryRequest>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Categories']
    }),
    updateCategory: builder.mutation<ApiResponse<Category>, [Category['id'], CreateCategoryRequest]>({
      query: ([id, body]) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Categories']
    })
  }),
})

export const {
  useGetCategoriesOptionsQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation
} = categoryApi
