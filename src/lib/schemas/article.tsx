import {z} from "zod"

const allowedFileExt = ["jpg", "jpeg", "png"]
export const createSchemaClient = z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    featuredImage: z
        .unknown()
        .transform((value) => value as FileList)
        .transform((value) => {
            if (value.length > 0)
                return value[0] as File
            return value[0] as unknown as undefined | null
        })
        .refine((value) => !!value, {message: "Featured image is missing!"})
        .refine((value) => {
            return value ? value.size <= 5 * 1024 * 1024 : true;
        }, {message: `File cannot be bigger than 5MB`})
        .refine((value) => value ? allowedFileExt.includes(value.name.split(".").reverse()[0]) : true,
            {
                message: `File extension is wrong. Allowed extensions are: ${allowedFileExt.join(", ")}`
            })

})

export const featuredImageSchemaClient = createSchemaClient.pick({featuredImage: true})

export const editSchemaClient = z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    featuredImage: z
        .unknown()
        .transform((value) => value ? value as FileList : value as null | undefined)
        .transform((value) => value ? value.item(0) as File : value)
        .refine((value) => {
            if (value) {
                return value.size <= 5 * 1024 * 1024;
            }
            return true
        }, {message: `File cannot be bigger than 5MB`})
        .refine((value) => value ? allowedFileExt.includes(value.name.split(".").reverse()[0]) : true, {message: `File extension is wrong. Allowed extensions are: ${allowedFileExt.join(", ")}`})

})

export const createSchemaServer = z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    featuredImage: z
        .instanceof(FormData)
        .transform((value) => value ? value.get("file") as File : value as undefined)
        .refine((value) => {
            if (value)
                return value.size <= 5 * 1024 * 1024;
            return true
        }, {message: "Cover image cannot be larger than 5MB"})
        .refine((value) => value ? allowedFileExt.includes(value.name.split(".").reverse()[0]) : true,
            {
                message: `File extension is wrong. Allowed extensions are: ${allowedFileExt.join(", ")}`
            })
})

export const editSchemaServer = z.object({
    title: z.string().min(1),
    excerpt: z.string().min(1),
    featuredImage: z
        .unknown()
        .transform(value => value ? value as FormData : value as null | undefined)
        .transform((value) => value ? value.get("file") as File : value as undefined)
        .refine((value) => {
            if (value) {
                return value.size <= 5 * 1024 * 1024;
            }
            return true
        }, {message: "Cover image cannot be larger than 5MB"})
        .refine((value) => value ? allowedFileExt.includes(value.name.split(".").reverse()[0]) : true,
            {
                message: `File extension is wrong. Allowed extensions are: ${allowedFileExt.join(", ")}`
            })

})
export type CreateArticleSchemaServer = z.infer<typeof createSchemaServer>
export type CreateArticleSchemaClient = z.infer<typeof createSchemaClient>
export type EditArticleSchemaClient = z.infer<typeof editSchemaClient>
export type EditArticleSchemaServer = z.infer<typeof editSchemaServer>
