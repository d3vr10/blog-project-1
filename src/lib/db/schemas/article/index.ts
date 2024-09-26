import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v7 } from "uuid";

const articleSchema = sqliteTable("article", {
    id: text("id").$defaultFn(v7).primaryKey(),
    title: text("title").notNull().unique(),
    slug: text("slug").notNull().unique(),
    content: text("content"),
    visible: integer("enabled", { mode: "boolean" }).default(false),
    active: integer("active", { mode: "boolean" }).default(true), 
})


export default articleSchema;