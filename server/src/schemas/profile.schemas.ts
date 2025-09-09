import z from "zod"

export const UpdateProfileSchema = z.object({
  firstName: z.string().optional().meta({ description: "User first name" }),
  lastName: z.string().optional().meta({ description: "User last name" }),
  email: z.string().optional().meta({ description: "User email" }),
}).meta({ id: "UpdateProfile", description: "Update profile schema" })

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(6).meta({ description: "User current password" }),
  newPassword: z.string().min(6).meta({ description: "User new password" }),
  confirmPassword: z.string().min(6).meta({ description: "User confirm password" }),
}).meta({ id: "UpdatePassword", description: "Update password schema" })
