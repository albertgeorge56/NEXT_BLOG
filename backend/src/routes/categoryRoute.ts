import { Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getAllCategories,
  getCategory,
} from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter
  .route("/")
  .get(expressAsyncHandler(getAllCategories))
  .post(expressAsyncHandler(addCategory));

categoryRouter.post("/delete", expressAsyncHandler(deleteCategory));

categoryRouter
  .route("/:id")
  .get(expressAsyncHandler(getCategory))
  .post(expressAsyncHandler(editCategory));

export default categoryRouter;
