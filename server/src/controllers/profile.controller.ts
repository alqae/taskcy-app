import { Response } from "express"
import bcrypt from "bcrypt"
import z from "zod"

import { UpdatePasswordSchema, UpdateProfileSchema } from "../schemas/profile.schemas"
import { errorResponse, successResponse } from "../utils/responseHandler"
import { AppDataSource } from "../data-source"
import { User } from "../entities/User"
import { IRequest } from "../types"

export const getProfile = async (req: IRequest, res: Response) => {
  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: req.user.id },
  })

  if (!user) {
    return errorResponse(res, "User not found", 404)
  }

  return successResponse(res, "User profile", user)
}

export const updateProfile = async (req: IRequest, res: Response) => {
  const body: z.infer<typeof UpdateProfileSchema> = req.body

  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: req.user.id },
  })

  if (!user) {
    return errorResponse(res, "User not found", 404)
  }

  user.firstName = body.firstName
  user.lastName = body.lastName
  user.email = body.email

  await AppDataSource.getRepository(User).save(user)

  return successResponse(res, "User profile updated", user)
}

export const updatePassword = async (req: IRequest, res: Response) => {
  const body: z.infer<typeof UpdatePasswordSchema> = req.body

  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: req.user.id },
  })

  if (!user) {
    return errorResponse(res, "User not found", 404)
  }

  const match = await bcrypt.compare(body.currentPassword, user.password)

  if (!match) {
    return errorResponse(res, "Invalid password", 400)
  }

  user.password = await bcrypt.hash(body.newPassword, 10)

  await AppDataSource.getRepository(User).save(user)

  return successResponse(res, "User password updated")
}

