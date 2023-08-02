import { Request, Response } from "express";
import { Movies, MoviesCreate, MoviesResulte } from "./inteface";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";

const getAllMovies = async (req: Request, res: Response): Promise<Response> => {
  const { category } = req.query;

  try {
    let queryString: string = `
      SELECT * FROM "movies";
    `;

    if (category) {
      queryString = `
        SELECT * FROM "movies"
        WHERE "category" = $1
        UNION ALL
        SELECT * FROM "movies"
        WHERE NOT EXISTS (SELECT 1 FROM "movies" WHERE "category" = $1);
      `;
    }

    const queryConfig: QueryConfig = {
      text: queryString,
      values: category ? [category] : [],
    };

    const queryResult: MoviesResulte = await client.query(queryConfig);
    const movies: Movies[] = queryResult.rows;

    return res.status(200).json(movies);
  } catch (error) {
    console.error("Error getting data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getMovieById = async (req: Request, res: Response): Promise<Response> => {
  const movieId = req.params.id;

  try {
    const queryString: string = `
      SELECT * FROM "movies" WHERE "id" = $1;
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [movieId],
    };

    const queryResult: MoviesResulte = await client.query(queryConfig);

    if (queryResult.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found!" });
    }

    const movie: Movies = queryResult.rows[0];
    return res.status(200).json(movie);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const insertQuery = async (req: Request, res: Response): Promise<Response> => {
  const payload: MoviesCreate = req.body;

  const querySearch = await client.query(
    "SELECT * FROM movies WHERE name = $1;",
    [payload.name]
  );

  if (querySearch.rowCount) {
    return res.status(409).json({ message: "name already registred!" });
  }

  const queryString: string = format(
    `
  INSERT INTO "movies" (%I)
  VALUES (%L)
  RETURNING *;
  `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult: MoviesResulte = await client.query(queryString);
  const movie: Movies = queryResult.rows[0];

  return res.status(201).json(movie);
};

const patchQuery = async (req: Request, res: Response): Promise<Response> => {
  const movieId = req.params.id;
  const payload: Partial<Movies> = req.body;

  const querySearch = await client.query(
    "SELECT * FROM movies WHERE id = $1;",
    [movieId]
  );

  if (!querySearch.rowCount) {
    return res.status(404).json({ message: "Movie not found!" });
  }

  if (payload.name) {
    const queryName = await client.query(
      "SELECT * FROM movies WHERE name = $1;",
      [payload.name]
    );
    if (queryName.rowCount) {
      return res.status(409).json({ message: "name already registred!" });
    }
  }
  try {
    const queryString: string = format(
      `
      UPDATE "movies"
      SET (%I) = ROW (%L)
      WHERE "id" = $1
      RETURNING *;
    `,
      Object.keys(payload),
      Object.values(payload)
    );

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [movieId],
    };

    const queryResult: MoviesResulte = await client.query(queryConfig);
    const movie: Movies = queryResult.rows[0];

    return res.status(200).json(movie);
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteQuery = async (req: Request, res: Response): Promise<Response> => {
  const movieId = req.params.id;

  try {
    const queryString: string = `
      DELETE FROM "movies"
      WHERE "id" = $1
      RETURNING *;
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [movieId],
    };

    const queryResult: MoviesResulte = await client.query(queryConfig);

    if (queryResult.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found!" });
    }

    const deletedMovie = queryResult.rows[0];

    return res.status(204).json(deletedMovie);
  } catch (error) {
    console.error("Error deleting data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export { insertQuery, patchQuery, deleteQuery, getAllMovies, getMovieById };
