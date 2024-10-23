import { Router } from "express";
import authRouter from "./authRoute";
import categoryRouter from "./categoryRoute";
import authMiddleware from "../middlewares/authMiddleware";
import postRouter from "./postRoute";
import galleryRouter from "./galleryRoute";

const rootRouter = Router();

rootRouter.use("/", authRouter);
rootRouter.use("/categories", authMiddleware, categoryRouter);
rootRouter.use("/posts", authMiddleware, postRouter);
rootRouter.use("/gallery", authMiddleware, galleryRouter);

export default rootRouter;
