import express, { Application, json } from "express";
import { startDatabase } from "./database";
import dotenv from "dotenv";
import {
  deleteQuery,
  getAllMovies,
  getMovieById,
  insertQuery,
  patchQuery,
} from "./logics";

dotenv.config();

const app: Application = express();
app.use(express.json());

app.get("/movies", getAllMovies);
app.get("/movies/:id", getMovieById);
app.post("/movies", insertQuery);
app.patch("/movies/:id", patchQuery);
app.delete("/movies/:id", deleteQuery);

app.listen(process.env.PORT, async () => {
  await startDatabase();
  console.log("listening");
});
