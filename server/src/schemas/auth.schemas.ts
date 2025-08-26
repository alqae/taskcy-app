import { z } from "zod"

export const LoginSchema = z.object({
  email: z.email().meta({ description: "User email" }),
  password: z.string().min(6).meta({ description: "User password" }),
  remember: z.boolean().default(false).meta({ description: "Remember me" }),
}).meta({ id: "Login", description: "Login schema" })

export const RegisterSchema = z.object({
  firstName: z.string().meta({ description: "User first name" }),
  lastName: z.string().meta({ description: "User last name" }),
  email: z.email().meta({ description: "User email" }),
  password: z.string().min(6).meta({ description: "User password" }),
}).meta({ id: "Register", description: "Register schema" })

export const InvalidCredentialsErrorSchema = z.object({
  message: z.string().default("Invalid credentials").meta({ description: "Error message" })
}).meta({ id: "InvalidCredentialsError", description: "Invalid credentials error schema" })

export const UserAlreadyExistsErrorSchema = z.object({
  message: z.string().default("User already exists").meta({ description: "Error message" })
}).meta({ id: "UserAlreadyExistsError", description: "User already exists error schema" })

export const TokenVersionMismatchErrorSchema = z.object({
  message: z.string().default("Token version mismatch").meta({ description: "Error message" })
}).meta({ id: "TokenVersionMismatchError", description: "Token version mismatch error schema" })

export const UserNotFoundErrorSchema = z.object({
  message: z.string().default("User not found").meta({ description: "Error message" })
}).meta({ id: "UserNotFoundError", description: "User not found error schema" })
