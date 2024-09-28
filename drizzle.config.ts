import { defineConfig } from "drizzle-kit";
export default defineConfig({
    dialect: "sqlite", // "mysql" | "sqlite" | "postgresql"
    schema: "./src/lib/db/schemas",
    out: "./drizzle",
    dbCredentials: {
        url: "file:./sqlite.db"
    }
});