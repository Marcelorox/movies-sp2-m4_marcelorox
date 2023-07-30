import { Client, QueryConfig, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();
export const client: Client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: 5432,
});

export const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("start database");
};
