import { Client, QueryConfig, QueryResult } from "pg";

const moviesConnect: Client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_,
  port: 5432,
});

const startDatabase = async (): Promise<void> => {
  await moviesConnect.connect();
  console.log("start database");
};
