import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQuery } from './apiConfig'
import type {
  ApiResponse,
  CreateTaskRequest,
  PaginatedRequest,
  PaginatedResponse,
  Task
} from '@types'

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery,
  tagTypes: ['Tasks'],
  endpoints: (builder) => ({
    getTasksOptions: builder.query<PaginatedResponse<Task>, PaginatedRequest>({
      query: (params) => ({
        url: '/tasks',
        method: 'GET',
        params
      }),
      providesTags: (_, error) => error ? [] : ['Tasks'],
    }),
    createTask: builder.mutation<ApiResponse<Task>, CreateTaskRequest>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Tasks']
    }),
    updateTask: builder.mutation<ApiResponse<Task>, [Task['id'], CreateTaskRequest]>({
      query: ([id, body]) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Tasks']
    }),
    archiveManyTasks: builder.mutation<void, Task['id'][]>({
      query: (body) => ({
        url: '/tasks/archive',
        method: 'PATCH',
        body: { taskIds: body }
      }),
      invalidatesTags: ['Tasks']
    }),
    deleteManyTasks: builder.mutation<void, Task['id'][]>({
      query: (body) => ({
        url: '/tasks',
        method: 'DELETE',
        body: { taskIds: body }
      }),
      invalidatesTags: ['Tasks']
    })
  }),
})

export const {
  useGetTasksOptionsQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useArchiveManyTasksMutation,
  useDeleteManyTasksMutation
} = taskApi
