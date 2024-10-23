import { Request, Response } from "express";
import { loginSchema } from "../utils/validationSchema";
import { prismaClient } from "../main";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customError";
import { jwtSecret } from "../utils/config";

/**
 * @route POST /login
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await prismaClient.user.findUnique({
    where: { email },
  });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new CustomError("Invalid Credentials.", 401);
  }
  const token = jwt.sign({ id: user.id }, jwtSecret as string);
  res.status(200).json({ success: true, token });
};

/**
 * @route POST /register
 */
export const register = (req: Request, res: Response) => {
  res.send("hello");
};
