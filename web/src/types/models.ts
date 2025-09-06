import { TaskPriority, TaskState } from './enums'

export class Category {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly color: string
  readonly user?: User
  readonly tasks: Task[]

  constructor(
    id: number,
    name: string,
    description: string,
    color: string,
    user?: User,
    tasks: Task[] = [],
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.color = color
    this.user = user
    this.tasks = tasks
  }
}

export class Tag {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly color: string
  readonly user?: User
  readonly tasks: Task[]

  constructor(
    id: number,
    name: string,
    description: string,
    color: string,
    user?: User,
    tasks: Task[] = [],
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.color = color
    this.user = user
    this.tasks = tasks
  }
}

export class Task {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly category: Category
  readonly tags: Tag[]
  readonly user?: User
  readonly state: TaskState
  readonly expiryDate: string
  readonly priority: TaskPriority
  readonly duration: string

  constructor(
    id: number,
    name: string,
    description: string,
    category: Category,
    tags: Tag[] = [],
    user?: User,
    state: TaskState = TaskState.TODO,
    expiryDate: string = new Date().toISOString(),
    priority: TaskPriority = TaskPriority.LOW,
    duration: string = '1d',
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.category = category
    this.tags = tags
    this.user = user
    this.state = state
    this.expiryDate = expiryDate
    this.priority = priority
    this.duration = duration
  }
}

export class User {
  readonly id: number
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly tokenVersion: number
  readonly categories: Category[]
  readonly tags: Tag[]
  readonly tasks: Task[]

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    tokenVersion: number,
    categories: Category[] = [],
    tags: Tag[] = [],
    tasks: Task[] = [],
  ) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.tokenVersion = tokenVersion
    this.categories = categories
    this.tags = tags
    this.tasks = tasks
  }
}

export class ItemOption {
  readonly value: string
  readonly label: string

  constructor(value: string, label: string) {
    this.value = value
    this.label = label
  }
}

export class Option {
  readonly value: string
  readonly label: string

  constructor(value: string, label: string) {
    this.value = value
    this.label = label
  }
}

