import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import * as schemas from "@/lib/db/schemas"
import env from "../env";

const dbClient = new Database(env.DB_PATH)

const db = drizzle(dbClient, { schema: schemas })

export default db