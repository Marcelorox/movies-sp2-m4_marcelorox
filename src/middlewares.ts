import { client } from "./database";
import { NextFunction, Request, Response } from "express";

const verifyId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const movieId = req.params.id;

  const querySearchId = await client.query(
    "SELECT * FROM movies WHERE id = $1;",
    [movieId]
  );

  if (!querySearchId.rowCount) {
    return res.status(404).json({ message: "Movie not found!" });
  }

  return next();
};

const verifyName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const payload = req.body;

  if (payload.name) {
    const queryName = await client.query(
      "SELECT * FROM movies WHERE name = $1;",
      [payload.name]
    );
    if (queryName.rowCount) {
      return res.status(409).json({ message: "name already registred!" });
    }
  }
  return next();
};
export { verifyId, verifyName };
