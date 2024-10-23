import express from "express";
import rootRouter from "./routes/rootRoute";
import errorMiddleware from "./middlewares/errorMiddleware";
import expressAsyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";
import { PORT } from "./utils/config";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

export const prismaClient = new PrismaClient();

app.use("/", rootRouter);

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
