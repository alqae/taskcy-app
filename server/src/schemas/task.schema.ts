import { z } from "zod"

import { TaskState, TaskPriority } from "../entities/Task"
import { CategorySchema } from "./category.schema"
import { userSchema } from "./user.schema"
import { TagSchema } from "./tag.schema"

export const TaskSchema = z.object({
  id: z.number().optional().meta({ description: "Task ID" }),
  name: z.string().meta({ description: "Task name" }),
  description: z.string().meta({ description: "Task description" }),
  state: z.enum(Object.values(TaskState)).default(TaskState.TODO).meta({ description: "Task state" }),
  priority: z.enum(Object.values(TaskPriority)).default(TaskPriority.LOW).meta({ description: "Task priority" }),
  expiryDate: z.string().default(new Date().toISOString()).meta({ description: "Task expiry date" }),
  categoryId: z.number().nullable().optional().meta({ description: "Category ID" }),
  tagIds: z.array(z.number()).optional().meta({ description: "Tag IDs" }),
}).meta({ id: "Task", description: "Task schema" })

export const CreateTaskSchema = TaskSchema.omit({ id: true }).meta({ id: "CreateTask", description: "Create task schema" })
export const UpdateTaskSchema = TaskSchema.omit({ id: true }).meta({ id: "UpdateTask", description: "Update task schema" })

export const TaskWithRelationSchema = TaskSchema.omit({ categoryId: true, tagIds: true }).extend({
  category: CategorySchema.omit({}),
  tags: z.array(TagSchema.omit({})),
  user: userSchema.omit({}),
}).meta({ id: "TaskWithRelation", description: "Task with relation schema" })
