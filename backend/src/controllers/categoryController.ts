import { Request, Response } from "express";
import { categorySchema } from "../utils/validationSchema";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { prismaClient } from "../main";
import CustomError from "../utils/customError";

export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await prismaClient.category.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      image: true,
    },
  });
  res.json({ success: true, categories });
};

export const addCategory = async (req: Request, res: Response) => {
  const { title, slug, content } = categorySchema.parse(req.body);
  let data: any = { title, slug, content };
  let category;
  const image = req.files?.image as any;
  if (req.files && image) {
    let dirPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const imageName = `${Date.now().toString(36)}-${uuidv4().split("-")[0]}-${
      (req.files?.image as any).name
    }`.replace(/\s+/g, "-");
    image.mv(path.join(dirPath, imageName));
    data = {
      ...data,
      image: {
        create: {
          name: imageName,
          path: `uploads/${imageName}`,
        },
      },
    };
  }
  category = await prismaClient.category.create({ data });
  res.json({ success: true, message: "Category Added", category });
};

export const getCategory = async (req: Request, res: Response) => {
  const category = await prismaClient.category.findUnique({
    where: { id: +req.params.id },
    include: { image: true },
  });
  if (!category) {
    res.status(400).json({ error: "Category not found" });
    return;
  }
  res.json({ success: true, category });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const postCount = await prismaClient.post.count({
    where: {
      categories: {
        some: {
          id: +req.body.id,
        },
      },
    },
  });

  if (postCount > 0) {
    res
      .status(400)
      .json({ error: "Cannot delete category with existing posts." });
    return;
  }
  await prismaClient.category.delete({
    where: { id: +req.body.id },
  });
  res.json({ success: true, message: "Category Deleted." });
};

export const editCategory = async (req: Request, res: Response) => {
  const { title, slug, content } = categorySchema.parse(req.body);
  const existingCategory = await prismaClient.category.count({
    where: {
      slug,
      id: {
        not: +req.params.id,
      },
    },
  });
  if (existingCategory) {
    throw new CustomError("Slug must be unique", 400);
  }
  const image = req.files?.image as any;
  let data: any = { title, slug, content };
  let category;
  if (req.files && image) {
    let dirPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const imageName = `${Date.now().toString(36)}-${uuidv4().split("-")[0]}-${
      (req.files?.image as any).name
    }`.replace(/\s+/g, "-");
    image.mv(path.join(dirPath, imageName));
    data = {
      ...data,
      image: {
        create: {
          name: imageName,
          path: `uploads/${imageName}`,
        },
      },
    };
  }
  category = await prismaClient.category.update({
    where: { id: Number(req.params.id) },
    data,
  });
  res.json({ success: true, message: "Category Updated", category });
};
