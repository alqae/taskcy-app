import { NextFunction, Response } from "express"

import { UserPayload } from "../entities/User"
import { decodeToken } from "../utils/auth"
import { IRequest } from "../types"

export const authMiddleware = (req: IRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" })
  }

  const token = authHeader.split(" ")[1] // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Token missing" })
  }

  try {
    const decoded = decodeToken<UserPayload>(token, false)
    req.user = { id: decoded.id, tokenVersion: decoded.tokenVersion }
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
