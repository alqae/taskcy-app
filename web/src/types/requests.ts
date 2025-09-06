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
