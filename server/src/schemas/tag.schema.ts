import z from "zod"

export const TagSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, "The name is required").meta({ description: "Tag name" }),
  description: z.string().optional().meta({ description: "Tag description" }),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).default("#000000").meta({ description: "Tag color" }),
}).meta({ id: "Tag", description: "Tag schema" })

export const CreateTagSchema = TagSchema.omit({ id: true }).meta({ id: "CreateTag", description: "Create tag schema" })

export const UpdateTagSchema = TagSchema.omit({ id: true }).meta({ id: "UpdateTag", description: "Update tag schema" })
