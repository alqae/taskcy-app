import { z } from "zod"

export const userSchema = z.object({
  id: z.number().int().meta({ description: "User ID" }),
  firstName: z.string().meta({ description: "User first name" }),
  lastName: z.string().meta({ description: "User last name" }),
  age: z.number().int().meta({ description: "User age" }),
  email: z.string().meta({ description: "User email" }),
  password: z.string().meta({ description: "User password" }),
  tokenVersion: z.number().int().default(0).meta({ description: "User token version" }),
}).meta({
  id: "User",
  description: "User schema"
});
