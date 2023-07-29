import { Request, Response } from "express";

const createProduct = (request: Request, response: Response) => {
  const newClient = request.body;

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 365);

  const newProduct: movies = {
    ...newClient,
  };

  return response.status(201).json(newProduct);
};
