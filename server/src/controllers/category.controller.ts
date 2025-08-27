import { Request, Response } from "express"
import z from "zod"

import { CreateCategorySchema, UpdateCategorySchema } from "../schemas/category.schema"
import { AppDataSource } from "../data-source"
import { Category } from "../entities/Category"
import { User } from "../entities/User"

export const getAll = async (_: Request, res: Response) => {
  const categories = await AppDataSource.getRepository(Category).find()
  return res.json(categories)
}

export const getOptions = async (_: Request, res: Response) => {
  const categories = await AppDataSource.getRepository(Category).find({
    select: ["id", "name"],
  })
  return res.json(categories.map((category) => ({ label: category.name, value: category.id })))
}

export const create = async (req: Request, res: Response) => {
  const body: z.infer<typeof CreateCategorySchema> = req.body
  const alreadyExists = await AppDataSource.getRepository(Category).findOne({
    where: { name: body.name },
  })

  if (alreadyExists) {
    return res.status(409).json({ message: "Category already exists" })
  }

  const userLogged = await AppDataSource.getRepository(User).findOne({
    where: { id: req.user.id },
  })

  const category = AppDataSource.getRepository(Category).create({
    ...body,
    user: userLogged,
  })

  await AppDataSource.getRepository(Category).save(category)
  return res.status(201).json(category)
}

export const update = async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.id)
  const category = await AppDataSource.getRepository(Category).findOne({
    where: { id: categoryId },
  })

  if (!category) {
    return res.status(404).json({ message: "Category not found" })
  }

  const body: z.infer<typeof UpdateCategorySchema> = req.body

  await AppDataSource.getRepository(Category).update(categoryId, body)
  return res.status(204).json()
}

export const remove = async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.id)
  const category = await AppDataSource.getRepository(Category).findOne({
    where: { id: categoryId },
  })

  if (!category) {
    return res.status(404).json({ message: "Category not found" })
  }

  await AppDataSource.getRepository(Category).remove(category)
  return res.status(204).json()
}
