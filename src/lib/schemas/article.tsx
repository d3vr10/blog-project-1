import { z } from "zod"

export const createSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().min(1),
    featuredImage: z.instanceof(FileList).nullable().refine((file: FileList | null) => file?.item(0)? file.item(0).size < 5 * 1024 * 1024 : true, {message: "File cannot be bigger than 5MB"}),

})

export type CreateArticleSchema = z.infer<typeof createSchema>