import path from "path"
import z from "zod"
import {logger} from "@/lib/logging/logger";

const envSchema = z.object({
    JWT_SECRET: z.string().min(1),
    JWT_ALGO: z.string().default("HS256"),
    DB_PATH: z.string().default(path.join(process.cwd(), "sqlite.db")),
    ARTICLE_DIR: z
        .string()
        .refine((value) => !path.isAbsolute(value), {message: "Absolute paths are not allowed"})
        .transform((value) => path.normalize(value))
        .default("articleData/"),
    EMAIL_USERNAME: z.string(),
    EMAIL_PASSWORD: z.string(),
    SMTP_HOSTNAME: z.string(),
    SMTP_PORT: z.number().default(587),
    SMTP_SECURITY: z.boolean().default(false),
    PASSWORD_RESET_EXPIRES: z.string().pipe(z.coerce.number()).transform((value) => value * 1000 * 60 * 60),
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_FORGOT_PASSWORD: z.string().url().optional(),
    S3_ACCESS_KEY_ID: z.string().url().optional()
        .refine(() => {
            logger.warn("S3_ACCESS_KEY_ID is missing. This disables uploading editor media to remote storage")
            return true
        }),
    S3_SECRET_ACCESS_KEY: z.string().url().optional()
        .refine(() => {
            logger.warn("S3_SECRET_ACCESS_KEY is missing. This disables uploading editor media to remote storage")
            return true
        }),

}).transform(value => {
    value.NEXT_PUBLIC_FORGOT_PASSWORD = new URL("/auth/forgot-password", value.NEXT_PUBLIC_SITE_URL).href
    return value
})

const env = envSchema.parse(process.env)

export default env