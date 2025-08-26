import { UserPayload } from "../../src/entities/User"

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload
    }
  }
}
