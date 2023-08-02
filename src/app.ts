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
import { verifyId, verifyName } from "./middlewares";

dotenv.config();

const app: Application = express();
app.use(express.json());

app.get("/movies", getAllMovies);
app.get("/movies/:id", verifyId, getMovieById);
app.post("/movies", verifyName, insertQuery);

app.patch("/movies/:id", verifyId, verifyName, patchQuery);

app.delete("/movies/:id", verifyId, deleteQuery);

app.listen(process.env.PORT, async () => {
  await startDatabase();
  console.log("listening");
});
