export enum Routes {
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/',
  NOTIFICATIONS = '/notifications',
  PROFILE = '/profile',
  ARCHIVE = '/archive',
  TASKS = '/tasks',
}

export enum TaskState {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}
