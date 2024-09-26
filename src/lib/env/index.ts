import z from "zod"

const envSchema = z.object({
    JWT_SECRET: z.string().min(1),
    JWT_ALGO: z.string().default("HS256"),
})

const env = envSchema.parse(process.env)

export default env