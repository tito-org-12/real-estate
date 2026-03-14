import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: "../../apps/server/.env",
  });
}

import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";

import * as schema from "./schema";

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

console.log('77777777777777777777777777777777777777777777777777',process.env.DATABASE_URL)
const sql = neon(
  process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_WtUqCazK10Do@ep-dawn-sun-ad6ds95v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
);
export const db = drizzle(sql, { schema });
