import { Response } from 'express'

export const successResponse = (res: Response, message: string, data: any = {}) => {
  return res.status(200).json({
    message,
    data,
  })
}

export const errorResponse = (res: Response, message: string, statusCode = 400, data: any = {}) => {
  return res.status(statusCode).json({
    message,
    data,
  })
}
