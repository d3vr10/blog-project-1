import { z } from "zod"

export const createSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().min(1),
    featuredImageURL: z.string().url().optional(),
})

export type CreateArticleSchema = z.infer<typeof createSchema>