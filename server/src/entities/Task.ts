import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm"

import { Category } from "./Category"
import { User } from "./User"
import { Tag } from "./Tag"

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

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    duration: string

    @ManyToOne(() => Category, category => category.tasks, { onDelete: "SET NULL" })
    @JoinColumn({ name: "category_id" })
    category: Category

    @ManyToMany(() => Tag, (tag) => tag.tasks)
    @JoinTable({
      name: "tasks_tags",
      joinColumn: { name: "task_id", referencedColumnName: "id" },
      inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
    })
    tags: Tag[]

    @ManyToOne(() => User, (user) => user.tasks)
    @JoinColumn({ name: "user_id" })
    user: User

    @Column({ type: "enum", enum: TaskState, default: TaskState.TODO })
    state: TaskState

    @Column({ type: "date" })
    expiryDate: Date

    @Column({ type: "enum", enum: TaskPriority, default: TaskPriority.LOW })
    priority: TaskPriority
}
