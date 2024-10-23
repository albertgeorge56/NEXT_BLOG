import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/config";
import { prismaClient } from "../main";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthenticated." });
    return;
  }
  jwt.verify(token, jwtSecret, async (err, decoded: any) => {
    if (err) {
      res.status(401).json({ error: "Invalid Token." });
      return;
    }
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.id },
    });
    req.user = user;
  });
  next();
};

export default authMiddleware;
