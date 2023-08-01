import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();
const client: Client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("start database");
};

export { client, startDatabase };
