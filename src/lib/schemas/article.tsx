import { z } from "zod"

const allowedFileExt = ["jpg", "jpeg", "png"]
export const createSchemaClient = z.object({
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
        }, { message: `File cannot be bigger than 5MB`})
        .refine((value) => value? allowedFileExt.includes(value.name.split(".").reverse()[0]): true, {message: `File extension is wrong. Allowed extensions are: ${allowedFileExt.join(", ")}`})

})

export const createSchemaServer = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().min(1),
    featuredImage: z
        .instanceof(FormData)
        .transform((value) => value.get("file") as File | undefined)
        .refine((value) => {
            if (value)
                return value.size <= 5 * 1024 * 1024;
            return true
        })



})
export type CreateArticleSchemaServer = z.infer<typeof createSchemaClient>
export type CreateArticleSchemaClient= z.infer<typeof createSchemaServer>
