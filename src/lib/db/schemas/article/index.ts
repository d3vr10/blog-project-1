import { integer, sqliteTable, text, } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";
import userSchema from "../user";



const articleSchema = sqliteTable("article", {
    id: text("id").$defaultFn(v7).primaryKey(),
    title: text("title").notNull().unique(),
    slug: text("slug").notNull(),
    content: text("content").notNull(),
    excerpt: text("excerpt").notNull(),
    featuredImageURL: text("featured_image_url"),
    visible: integer("enabled", { mode: "boolean" }).default(false),
    active: integer("active", { mode: "boolean" }).default(true),
    userId: text("user_id", { length: 36 }).notNull().references(() => userSchema.id),
})


export default articleSchema;