import { Response } from "express"
import { Like } from "typeorm"
import z from "zod"

import { CreateCategorySchema, UpdateCategorySchema } from "../schemas/category.schema"
import { successResponse } from "../utils/responseHandler"
import { AppDataSource } from "../data-source"
import { Category } from "../entities/Category"
import { User } from "../entities/User"
import { IRequest } from "../types"

export const getAll = async (req: IRequest, res: Response) => {
  if (!req.query.take || !req.query.skip || !req.query.sort_by || !req.query.sort_order) {
    return res.status(400).json({ message: "Missing query/sort parameters" })
  }

  const take = parseInt(req.query.take as string)
  const skip = parseInt(req.query.skip as string)

  const sort_by = req.query.sort_by as string
  const sort_order = req.query.sort_order as "ASC" | "DESC"

  const queryBuilder = AppDataSource.getRepository(Category).createQueryBuilder('category')

  queryBuilder.leftJoinAndSelect("category.user", "user")

  queryBuilder.orderBy({ [`category.${sort_by}`]: sort_order })

  if (req.query.search) {
    queryBuilder.andWhere({ name: Like(`%${req.query.search}%`) })
  }

  const categories = await queryBuilder.take(take).skip(skip).getMany()
  const count = await queryBuilder.getCount()

  const totalPages = Math.ceil(count / take)

  return res.json({
    hits: categories,
    total: count,
    totalPages,
  })
}

export const getOptions = async (_: IRequest, res: Response) => {
  const categories = await AppDataSource.getRepository(Category).find({
    select: ["id", "name"],
  })
  return successResponse(
    res,
    "Categories",
    categories.map((category) => ({ label: category.name, value: category.id.toString() }))
  )
}

export const create = async (req: IRequest, res: Response) => {
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

export const update = async (req: IRequest, res: Response) => {
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

export const remove = async (req: IRequest, res: Response) => {
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
