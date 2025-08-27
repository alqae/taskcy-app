import z from "zod"

export const CategorySchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, "The name is required").meta({ description: "Category name" }),
  description: z.string().optional().meta({ description: "Category description" }),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).default("#000000").meta({ description: "Category color" }),
}).meta({ id: "Category", description: "Category schema" })

export const CreateCategorySchema = CategorySchema.omit({ id: true }).meta({ id: "CreateCategory", description: "Create category schema" })

export const UpdateCategorySchema = CategorySchema.omit({ id: true }).meta({ id: "UpdateCategory", description: "Update category schema" })

export const ItemOptionSchema = z.object({
  label: z.string().meta({ description: "Item option label" }),
  value: z.string().meta({ description: "Item option value" }),
}).meta({ id: "ItemOption", description: "Item option schema" })
