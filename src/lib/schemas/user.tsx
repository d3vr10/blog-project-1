import { z } from "zod"

export const userCreateSchema = z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string(),
    repeatPassword: z.string()
}).refine((schemaData) => schemaData.repeatPassword === schemaData.password, { 
    message: "Both passwords must match!",
    path: ["repeatPassword"] 
})

export type UserCreateType = z.infer<typeof userCreateSchema>