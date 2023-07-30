import express, { json } from "express";
import { client, startDatabase } from "./database";
import { QueryResult, QueryConfig, Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

interface Movies {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
}

type MoviesCreate = Omit<Movies, "id">;
type MoviesResulte = QueryResult<Movies>;

// const app = express();
// app.use(express.json());

// app.post("/movies");

const insertQuery = async (payload: MoviesCreate): Promise<Movies> => {
  const queryString: string = `
  INSERT INTO "movies" ("name", "price", "category", "duration")
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `;

  const QueryConfig: QueryConfig = {
    text: queryString,
    values: Object.values(payload),
  };
  const queryResult: MoviesResulte = await client.query(QueryConfig);
  const movie: Movies = queryResult.rows[0];

  return movie;
};

const main = async (): Promise<void> => {
  await startDatabase();

  const newMovie: MoviesCreate = {
    name: "filme",
    price: 30,
    category: "terror",
    duration: 3000,
  };

  const movie: Movies = await insertQuery(newMovie);
  console.log(movie);

  await client.end();
};

main();
