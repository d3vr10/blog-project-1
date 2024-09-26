import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import * as schemas from "@/lib/db/schemas"

const dbClient = new Database(path.join(process.cwd(), "sqlite.db"))

const db = drizzle(dbClient, { schema: schemas })

export default db