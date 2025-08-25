import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email().meta({
    description: "User email"
  }),
  password: z.string().min(6).meta({
    description: "User password"
  }),
  remember: z.boolean().default(false).meta({
    description: "Remember me"
  }),
}).meta({
  id: "Login",
  description: "Login schema"
});

