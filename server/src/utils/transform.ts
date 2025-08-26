import { Response, Request, NextFunction } from "express"

import { instanceToPlain } from "class-transformer"

export const transformResponse = (req: Request, res: Response, next: NextFunction) => {
  const oldJson = res.json

  res.json = function (data) {
    const transformed = instanceToPlain(data)
    return oldJson.call(this, transformed)
  }

  next()
}
