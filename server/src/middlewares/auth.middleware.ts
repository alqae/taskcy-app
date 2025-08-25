import { NextFunction, Request, Response } from "express"

import { UserPayload } from "../entity/User"
import { decodeToken } from "../utils/auth"

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
