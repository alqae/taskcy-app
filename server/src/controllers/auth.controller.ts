import { Request, Response } from "express"
import bcrypt from "bcrypt"
import z from "zod"

import { createAccessToken, createRefreshToken, decodeToken, sendRefreshToken } from "../utils/auth"
import { LoginSchema, RegisterSchema } from "../schemas/auth.schemas"
import { User, UserPayload } from "../entity/User"
import { AppDataSource } from "../data-source"

export const login = async (req: Request, res: Response) => {
  const body: z.infer<typeof LoginSchema> = req.body

  const user = await AppDataSource.getRepository(User).findOne({
    where: { email: body.email },
  })

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const match = await bcrypt.compare(body.password, user.password)

  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  if (body.remember) {
    sendRefreshToken(res, createRefreshToken(user))
  }

  return res.json({ accessToken: createAccessToken(user), user })
}

export const register = async (req: Request, res: Response) => {
  const body: z.infer<typeof RegisterSchema> = req.body

  const user = await AppDataSource.getRepository(User).findOne({
    where: { email: body.email },
  })

  if (user) {
    return res.status(409).json({ message: "User already exists" })
  }

  const hashedPassword = await bcrypt.hash(body.password, 10)

  const newUser = AppDataSource.getRepository(User).create({
    ...body,
    password: hashedPassword,
  })

  await AppDataSource.getRepository(User).save(newUser)

  sendRefreshToken(res, createRefreshToken(newUser))

  return res.status(201).json({ accessToken: createAccessToken(newUser), user: newUser })
}

export const logout = (_: Request, res: Response) => {
  res.clearCookie("jid")
  return res.json({ message: "Logout successful" })
}

export const getProfile = async (req: Request, res: Response) => {
  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: req.user.id },
  })

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  return res.json(user)
}

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.jid

  if (!token) {
    return res.status(401).json({ message: "No token provided" })
  }

  try {
    const payload = decodeToken<UserPayload>(token, true)
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: payload.id },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ message: "Token version mismatch" })
    }

    user.tokenVersion++
    await AppDataSource.getRepository(User).save(user)

    sendRefreshToken(res, createRefreshToken(user))
    return res.json({ accessToken: createAccessToken(user), user })
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
