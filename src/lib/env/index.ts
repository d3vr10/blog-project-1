import path from "path"
import z from "zod"

const envSchema = z.object({
    JWT_SECRET: z.string().min(1),
    JWT_ALGO: z.string().default("HS256"),
    DB_PATH: z.string().default(path.join(process.cwd(), "sqlite.db")),
    ARTICLE_DATA_DIR: z
        .string()
        .refine((value) => !path.isAbsolute(value), {message: "Absolute paths are not allowed"})
        .transform((value) => path.normalize(value))
        .default("articleData/"),
})

const env = envSchema.parse(process.env)

export default env