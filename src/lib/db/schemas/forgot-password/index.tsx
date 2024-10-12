import {sqliteTable, text, integer} from "drizzle-orm/sqlite-core";
import {userSchema} from "@/lib/db/schemas";
import env from "@/lib/env";

const forgotPasswordSchema = sqliteTable("forgot_password", {
    userId: text("user_id").primaryKey().references(() => userSchema.id),
    token: text("token").notNull().unique(),
    expiresIn: integer("expires_in", {mode: "timestamp_ms"}).notNull().$defaultFn(() => new Date(Date.now() + env.PASSWORD_RESET_EXPIRES)),
})

export default forgotPasswordSchema;