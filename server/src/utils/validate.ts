import { Request, Response, NextFunction } from 'express'
import { ZodType, ZodError } from 'zod'

export const validate = <T>(schema: ZodType<T>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    schema.parse(req.body)
    next()
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = JSON.parse(err.message)
      return res.status(400).json({ message: 'Validation error', errors })
    }

    return res.status(400).json({
      message: 'Validation error',
      errors: err instanceof Error ? err.message : undefined,
    })
  }
}
