import { Request } from "express"

import { UserPayload } from "./entities/User"

export interface IRequest extends Request {
  user?: UserPayload
}
