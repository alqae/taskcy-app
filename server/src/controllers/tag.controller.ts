import { Response } from "express"
import { Like } from "typeorm"
import z from "zod"

import { CreateTagSchema, UpdateTagSchema } from "../schemas/tag.schema"
import { successResponse } from "../utils/responseHandler"
import { AppDataSource } from "../data-source"
import { User } from "../entities/User"
import { Tag } from "../entities/Tag"
import { IRequest } from "../types"

export const getAll = async (req: IRequest, res: Response) => {
  if (!req.query.take || !req.query.skip || !req.query.sort_by || !req.query.sort_order) {
    return res.status(400).json({ message: "Missing query/sort parameters" })
  }

  const take = parseInt(req.query.take as string)
  const skip = parseInt(req.query.skip as string)

  const sort_by = req.query.sort_by as string
  const sort_order = req.query.sort_order as "ASC" | "DESC"

  const queryBuilder = AppDataSource.getRepository(Tag).createQueryBuilder('tag')

  queryBuilder.leftJoinAndSelect("tag.user", "user")

  queryBuilder.orderBy({ [`tag.${sort_by}`]: sort_order })

  if (req.query.search) {
    queryBuilder.andWhere({ name: Like(`%${req.query.search}%`) })
  }

  const tags = await queryBuilder.take(take).skip(skip).getMany()
  const count = await queryBuilder.getCount()

  const totalPages = Math.ceil(count / take)

  return res.json({
    hits: tags,
    total: count,
    totalPages,
  })
}

export const getOptions = async (_: IRequest, res: Response) => {
  const tags = await AppDataSource.getRepository(Tag).find({
    select: ["id", "name"],
  })
  return successResponse(
    res,
    "Tags",
    tags.map((tag) => ({ label: tag.name, value: tag.id.toString() }))
  )
}

export const create = async (req: IRequest, res: Response) => {
  const body: z.infer<typeof CreateTagSchema> = req.body
  const alreadyExists = await AppDataSource.getRepository(Tag).findOne({
    where: { name: body.name },
  })

  if (alreadyExists) {
    return res.status(409).json({ message: "Tag already exists" })
  }

  const userLogged = await AppDataSource.getRepository(User).findOne({
    where: { id: req.user.id },
  })

  const tag = AppDataSource.getRepository(Tag).create({
    ...body,
    user: userLogged,
  })

  await AppDataSource.getRepository(Tag).save(tag)
  return res.status(201).json(tag)
}

export const update = async (req: IRequest, res: Response) => {
  const tagId = parseInt(req.params.id)
  const tag = await AppDataSource.getRepository(Tag).findOne({
    where: { id: tagId },
  })

  if (!tag) {
    return res.status(404).json({ message: "Tag not found" })
  }

  const body: z.infer<typeof UpdateTagSchema> = req.body

  await AppDataSource.getRepository(Tag).update(tagId, body)
  return res.status(204).json()
}
