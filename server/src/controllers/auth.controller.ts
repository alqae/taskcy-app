import { Response } from "express"
import bcrypt from "bcrypt"
import z from "zod"

import { createAccessToken, createRefreshToken, decodeToken, sendRefreshToken } from "../utils/auth"
import { errorResponse, successResponse } from "../utils/responseHandler"
import { LoginSchema, RegisterSchema } from "../schemas/auth.schemas"
import { User, UserPayload } from "../entities/User"
import { AppDataSource } from "../data-source"
import { IRequest } from "../types"

export const login = async (req: IRequest, res: Response) => {
  const body: z.infer<typeof LoginSchema> = req.body

  const user = await AppDataSource.getRepository(User).findOne({
    where: { email: body.email },
  })

  if (!user) {
    return errorResponse(res, "Invalid credentials", 401)
  }

  const match = await bcrypt.compare(body.password, user.password)

  if (!match) {
    return errorResponse(res, "Invalid credentials", 401)
  }

  user.tokenVersion = 1
  await AppDataSource.getRepository(User).save(user)

  if (body.remember) {
    sendRefreshToken(res, createRefreshToken(user))
  }

  res.header("Authorization", `Bearer ${createAccessToken(user)}`)
  return successResponse(res, "Login successful", user)
}

export const register = async (req: IRequest, res: Response) => {
  const body: z.infer<typeof RegisterSchema> = req.body

  const user = await AppDataSource.getRepository(User).findOne({
    where: { email: body.email },
  })

  if (user) {
    return errorResponse(res, "User already exists", 409)
  }

  const hashedPassword = await bcrypt.hash(body.password, 10)

  const newUser = AppDataSource.getRepository(User).create({
    ...body,
    password: hashedPassword,
  })

  await AppDataSource.getRepository(User).save(newUser)

  sendRefreshToken(res, createRefreshToken(newUser))

  res.header("Authorization", `Bearer ${createAccessToken(newUser)}`)
  return successResponse(res, "User registered successfully", newUser)
}

export const logout = async (req: IRequest, res: Response) => {
  const userLogged = await AppDataSource.getRepository(User).findOne({
    where: { id: req.user.id },
  })

  if (!userLogged) {
    return errorResponse(res, "User not found", 404)
  }

  userLogged.tokenVersion = 0
  await AppDataSource.getRepository(User).save(userLogged)

  res.clearCookie("jid")
  return successResponse(res, "Logout successful")
}

export const getProfile = async (req: IRequest, res: Response) => {
  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: req.user.id },
  })

  if (!user) {
    return errorResponse(res, "User not found", 404)
  }

  return successResponse(res, "User profile", user)
}

export const refreshToken = async (req: IRequest, res: Response) => {
  const token = req.cookies.jid

  if (!token) {
    return errorResponse(res, "No token provided", 401)
  }

  try {
    const payload = decodeToken<UserPayload>(token, true)
    let user = await AppDataSource.getRepository(User).findOne({ where: { id: payload.id } })

    if (!user) {
      return errorResponse(res, "User not found", 404)
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return errorResponse(res, "Token version mismatch", 401)
    }

    user.tokenVersion++
    await AppDataSource.getRepository(User).save(user)

    const newRefreshToken = createRefreshToken(user)
    const newAccessToken = createAccessToken(user)

    sendRefreshToken(res, newRefreshToken)
    res.header("Authorization", newAccessToken)
    return successResponse(res, "Refresh token successful", user)
  } catch (error) {
    res.cookie("jid", "", { httpOnly: true, secure: false, sameSite: "lax", expires: new Date(0) })
    return errorResponse(res, "Invalid token", 401)
  }
}
