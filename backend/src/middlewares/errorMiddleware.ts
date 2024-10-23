import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/customError";
import { ZodError } from "zod";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.status || 400).json({
      error: err.message,
    });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: err.flatten().fieldErrors,
    });
    return;
  }
  res.status(400).json({
    error: err.message,
  });
  return;
};

export default errorMiddleware;
