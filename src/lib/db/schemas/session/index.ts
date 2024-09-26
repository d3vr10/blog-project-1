import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";
import userSchema from "../user";

const sessionSchema = sqliteTable("session", {
    id: text("id", { length: 36 }).$defaultFn(v7).primaryKey(),
    userID: text("user_id", { length: 36 }).notNull().references(() => userSchema.id),
}) 

export default sessionSchema;