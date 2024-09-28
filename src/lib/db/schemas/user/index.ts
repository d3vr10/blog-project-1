import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

const userSchema = sqliteTable("user", {
    id: text("id", { length: 36 }).$defaultFn(v7).primaryKey(),
    email: text("email").notNull().unique(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    firstName: text("firstname"),
    middleName: text("middlename"),
    lastName: text("lastname"),
    secondLastName: text("second_lastname"),
})

export default userSchema;