import { Request, Response } from "express"
import { In } from "typeorm"
import z from "zod"

import { CreateTaskSchema, UpdateTaskSchema } from "../schemas"
import { Task, TaskState } from "../entities/Task"
import { AppDataSource } from "../data-source"
import { Category } from "../entities/Category"
import { User } from "../entities/User"
import { Tag } from "../entities/Tag"

export const getAll = async (req: Request, res: Response) => {
  // TODO add state, expiry_date, priority, category_id, search (name, description), tags_ids, sort_by and sort_order

  const tasks = await AppDataSource.getRepository(Task).find({
    relations: {
      category: true,
      tags: true,
    },
    where: {
      user: {
        id: req.user.id
      }
    }
  })

  return res.json(tasks)
}

export const create = async (req: Request, res: Response) => {
  const { name, description, categoryId, tagIds, state, priority, expiryDate } = req.body as z.infer<typeof CreateTaskSchema>

  const tags = await AppDataSource.getRepository(Tag).find({
    where: {
      id: In(tagIds)
    }
  })

  const category = await AppDataSource.getRepository(Category).findOne({
    where: {
      id: categoryId
    }
  })

  if (!category) {
    return res.status(404).json({ message: "Category not found" })
  }

  if (tags.length === 0) {
    return res.status(404).json({ message: "Tags not found" })
  }

  const userLogged = await AppDataSource.getRepository(User).findOne({
    where: {
      id: req.user.id
    }
  })

  const task = AppDataSource.getRepository(Task).create({
    name,
    description,
    category,
    tags,
    state,
    priority,
    expiryDate,
    user: userLogged
  })

  await AppDataSource.getRepository(Task).save(task)

  return res.json(task)
}

export const update = async (req: Request, res: Response) => {
  const { name, description, categoryId, tagIds, state, priority, expiryDate } = req.body as z.infer<typeof UpdateTaskSchema>

  const taskId = parseInt(req.params.id)
  const task = await AppDataSource.getRepository(Task).findOne({
    where: {
      id: taskId
    }
  })

  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }

  const category = await AppDataSource.getRepository(Category).findOne({
    where: {
      id: categoryId
    }
  })

  if (!category) {
    return res.status(404).json({ message: "Category not found" })
  }

  const tags = await AppDataSource.getRepository(Tag).find({
    where: {
      id: In(tagIds)
    }
  })

  if (tags.length === 0) {
    return res.status(404).json({ message: "Tags not found" })
  }

  task.name = name
  task.description = description
  task.state = state
  task.priority = priority
  task.expiryDate = new Date(expiryDate)
  task.category = category
  task.tags = tags

  await AppDataSource.getRepository(Task).save(task)
  return res.json(task)
}

export const remove = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id)
  const task = await AppDataSource.getRepository(Task).findOne({
    where: {
      id: taskId
    }
  })

  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }

  await AppDataSource.getRepository(Task).remove(task)

  return res.status(204).json()
}

export const toggleComplete = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id)
  const task = await AppDataSource.getRepository(Task).findOne({
    where: {
      id: taskId
    }
  })

  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }

  if (task.state === TaskState.COMPLETED) {
    task.state = TaskState.TODO
  } else {
    task.state = TaskState.COMPLETED
  }

  await AppDataSource.getRepository(Task).save(task)

  return res.json(task)
}
