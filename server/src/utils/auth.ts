import { sign, verify } from "jsonwebtoken"
import { Response } from "express"

import { User } from "../entities/User"

export const decodeToken = <T>(token: string, isRefreshToken: boolean): T | null => {
  try {
    const decoded = verify(
      token,
      isRefreshToken
        ? process.env.REFRESH_TOKEN_SECRET!
        : process.env.ACCESS_TOKEN_SECRET!
    )
    return decoded as T
  } catch (err) {
    return null
  }
}

export const createAccessToken = (user: User) => {
  return sign({ id: user.id, tokenVersion: user.tokenVersion }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m"
  })
}

export const createRefreshToken = (user: User) => {
  return sign(
    { id: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d"
    }
  )
}

export const sendRefreshToken = (res: Response, token: string) => {
  const isDevelopment = process.env.NODE_ENV === "development"
  res.cookie("jid", token, {
    httpOnly: true,
    secure: !isDevelopment,
    sameSite: isDevelopment ? 'lax' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  })
}
