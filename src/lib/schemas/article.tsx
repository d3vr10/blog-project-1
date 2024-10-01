import { z } from "zod"

export const createSchemaServer = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().min(1),
    featuredImage: z
        .unknown()
        .transform((value) => value as FileList | undefined | null)
        .transform((value) =>  value?.item(0) )
        .refine((value) => {
            if (value) {
                return value.size <= 5 * 1024 * 1024;
            }
            return true
        }, { message: `File "${value.name}" cannot be bigger than 5MB`})

})

export type CreateArticleSchema = z.infer<typeof createSchema>