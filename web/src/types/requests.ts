import type { TaskPriority, TaskState } from './enums'
import type { Category, Tag } from './models'

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  firstName: string
  lastName: string
  password: string
}

export interface GetTaskRequest extends PaginatedRequest {
  tags_ids: string[]
  states: TaskState[]
  priorities: string[]
  category_id: string[]
  expiry_date?: string
  search?: string
}

export interface GetTagRequest extends PaginatedRequest {
  search?: string
}

export interface GetCategoryRequest extends PaginatedRequest {
  search?: string
}

export interface CreateTaskRequest {
  id?: number
  name: string
  description: string
  state: TaskState
  priority: TaskPriority
  expiryDate: string
  categoryId?: Category['id']
  tagIds?: Tag['id'][]
}

export interface CreateTagRequest {
  name: string
  description: string
  color: string
}

export interface CreateCategoryRequest {
  name: string
  description: string
  color: string
}

export interface PaginatedRequest {
  take: number
  skip: number
  sort_by: string
  sort_order: 'asc' | 'desc'
}

export interface UpdateProfileRequest {
  firstName: string
  lastName: string
  email: string
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
