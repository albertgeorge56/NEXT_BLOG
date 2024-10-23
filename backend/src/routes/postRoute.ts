import { Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  addPost,
  deletePost,
  editPost,
  getAllPosts,
  getPost,
} from "../controllers/postController";

const postRouter = Router();

postRouter
  .route("/")
  .get(expressAsyncHandler(getAllPosts))
  .post(expressAsyncHandler(addPost))
  .delete(expressAsyncHandler(deletePost));

postRouter.post("/delete", expressAsyncHandler(deletePost));

postRouter
  .route("/:id")
  .get(expressAsyncHandler(getPost))
  .post(expressAsyncHandler(editPost));

export default postRouter;
