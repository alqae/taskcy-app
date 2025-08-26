import { TaskPriority, TaskState } from './enums'

export class Category {
  id: number = 0;
  name: string = '';
  description: string = '';
  color: string = '';
  user?: User;
  tasks: Task[] = [];

  constructor(init?: Partial<Category>) {
    Object.assign(this, init);
  }
}

export class Tag {
  id: number = 0;
  name: string = '';
  description: string = '';
  color: string = '';
  user?: User;
  tasks: Task[] = [];

  constructor(init?: Partial<Tag>) {
    Object.assign(this, init);
  }
}

export class Task {
  id: number = 0;
  name: string = '';
  description: string = '';
  category?: Category;
  tags: Tag[] = [];
  user?: User;
  state: TaskState = TaskState.TODO;
  expiryDate: Date = new Date();
  priority: TaskPriority = TaskPriority.LOW;

  constructor(init?: Partial<Task>) {
    Object.assign(this, init);
  }
}

export class User {
  id: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  tokenVersion: number = 0;
  categories: Category[] = [];
  tags: Tag[] = [];
  tasks: Task[] = [];

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
