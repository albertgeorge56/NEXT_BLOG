import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { getAllGallery } from "../controllers/galleryController";

const galleryRouter = Router();

galleryRouter.route("/").get(expressAsyncHandler(getAllGallery));
//   .post(expressAsyncHandler(addGalley));

export default galleryRouter;
