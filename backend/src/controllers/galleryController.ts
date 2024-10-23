import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { prismaClient } from "../main";

export const getAllGallery = async (req: Request, res: Response) => {
  const gallery = await prismaClient.gallery.findMany({
    orderBy: {
      id: "desc",
    },
  });
  res.json({ success: true, gallery });
};
