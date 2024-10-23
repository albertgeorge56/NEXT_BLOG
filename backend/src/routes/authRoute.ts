import { Request, Response, Router } from "express";
import { login, register } from "../controllers/authController";
import expressAsyncHandler from "express-async-handler";

const authRouter = Router();

authRouter.post("/login", expressAsyncHandler(login));
authRouter.post("/register", register);

export default authRouter;
