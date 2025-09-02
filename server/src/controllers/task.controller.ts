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
  if (!req.query.take || !req.query.skip || !req.query.sort_by || !req.query.sort_order) {
    return res.status(400).json({ message: "Missing query/sort parameters" })
  }

  const take = parseInt(req.query.take as string)
  const skip = parseInt(req.query.skip as string)

  const sort_by = req.query.sort_by as string
  const sort_order = req.query.sort_order as "ASC" | "DESC"

  const queryBuilder = AppDataSource.getRepository(Task).createQueryBuilder('task')

  queryBuilder.leftJoinAndSelect("task.user", "user").where({
    user: {
      id: req.user.id
    }
  })

  queryBuilder.orderBy({ [`task.${sort_by}`]: sort_order })

  if (req.query.expiry_date) {
    queryBuilder.andWhere({
      expiryDate: req.query.expiry_date,
    })
  }

  if (req.query.states) {
    queryBuilder.andWhere({
      state: In((req.query.states as string).split(','))
    })
  } else {
    queryBuilder.andWhere({
      state: In([TaskState.TODO, TaskState.IN_PROGRESS, TaskState.COMPLETED])
    })
  }

  if (req.query.priorities) {
    queryBuilder.andWhere({
      priority: In((req.query.priorities as string).split(','))
    })
  }

  if (req.query.category_id) {
    queryBuilder.andWhere({
      category: {
        id: In((req.query.category_id as string).split(','))
      }
    })
  }

  if (req.query.tags_ids) {
    const tagIds = (req.query.tags_ids as string).split(',');

    queryBuilder.andWhere(
      `EXISTS (
        SELECT 1 FROM tasks_tags tt
        WHERE tt.task_id = task.id
        AND tt.tag_id IN (:...tagIds)
      )`,
      { tagIds }
    );
  }

  if (req.query.search) {
    queryBuilder.andWhere(
      (qb) => {
        const subQuery = qb.subQuery()
          .select('task.id')
          .from(Task, 'task')
          .where('task.name LIKE :search OR task.description LIKE :search')
          .getQuery();
        return 'task.id IN ' + subQuery;
      },
      { search: `%${req.query.search}%` }
    );
  }

  const tasks = await queryBuilder
    .take(take)
    .skip(skip)
    .leftJoinAndSelect('task.category', 'category')
    .leftJoinAndSelect('task.tags', 'tag')
    .getMany()

  const count = await queryBuilder.getCount()

  const totalPages = Math.ceil(count / take)

  return res.json({
    hits: tasks,
    total: count,
    totalPages,
  })
}

export const create = async (req: Request, res: Response) => {
  const {
    name,
    description,
    categoryId,
    tagIds,
    state,
    priority,
    expiryDate,
    duration
  } = req.body as z.infer<typeof CreateTaskSchema>

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
    duration,
    user: userLogged
  })

  await AppDataSource.getRepository(Task).save(task)

  return res.json(task)
}

export const update = async (req: Request, res: Response) => {
  const {
    name,
    description,
    categoryId,
    tagIds,
    state,
    priority,
    expiryDate,
    duration
  } = req.body as z.infer<typeof UpdateTaskSchema>

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
  task.duration = duration
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
