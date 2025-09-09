import { createApi } from '@reduxjs/toolkit/query/react'
import { enqueueSnackbar } from 'notistack'

import { baseQuery } from './apiConfig'
import type {
  ApiResponse,
  CreateTaskRequest,
  GetTaskRequest,
  PaginatedResponse,
  Task
} from '@types'

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery,
  tagTypes: ['Tasks'],
  endpoints: (builder) => ({
    getTasks: builder.query<PaginatedResponse<Task>, GetTaskRequest>({
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
      invalidatesTags: ['Tasks'],
      async onQueryStarted(_, { queryFulfilled }) {
        await queryFulfilled
        enqueueSnackbar('Tasks archived successfully', { variant: 'success' })
      }
    }),
    deleteManyTasks: builder.mutation<void, Task['id'][]>({
      query: (body) => ({
        url: '/tasks',
        method: 'DELETE',
        body: { taskIds: body }
      }),
      invalidatesTags: ['Tasks'],
      async onQueryStarted(_, { queryFulfilled }) {
        await queryFulfilled
        enqueueSnackbar('Tasks deleted successfully', { variant: 'success' })
      }
    })
  }),
})

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useArchiveManyTasksMutation,
  useDeleteManyTasksMutation
} = taskApi
