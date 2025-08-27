// db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "./shared/schema"; // Adjust if your schema path is different
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
