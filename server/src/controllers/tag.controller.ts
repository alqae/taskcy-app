import { Request, Response } from "express"
import z from "zod"

import { CreateTagSchema } from "../schemas/tag.schema"
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { Tag } from "../entity/Tag"

export const getAll = async (_: Request, res: Response) => {
  const tags = await AppDataSource.getRepository(Tag).find()
  return res.json(tags)
}

export const create = async (req: Request, res: Response) => {
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
