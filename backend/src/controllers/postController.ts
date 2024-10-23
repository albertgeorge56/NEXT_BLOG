import { Request, Response } from "express";
import { categorySchema, postSchema } from "../utils/validationSchema";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { prismaClient } from "../main";
import CustomError from "../utils/customError";

export const getAllPosts = async (req: Request, res: Response) => {
  const posts = await prismaClient.post.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      categories: true,
      image: true,
    },
  });
  res.json({ success: true, posts });
};

export const addPost = async (req: Request, res: Response) => {
  const { title, slug, content, categoryIds } = postSchema.parse(req.body);
  let data: any = {
    title,
    slug,
    content,
    categories: {
      connect: categoryIds.map((id) => ({
        id,
      })),
    },
  };

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
  const post = await prismaClient.post.create({
    data,
  });
  res.json({ success: true, message: "Post Added", post });
};

export const getPost = async (req: Request, res: Response) => {
  const post = await prismaClient.post.findUnique({
    where: { id: +req.params.id },
    include: {
      categories: true,
    },
  });
  res.json({ success: true, post });
};

export const deletePost = async (req: Request, res: Response) => {
  await prismaClient.post.delete({
    where: { id: +req.body.id },
  });
  res.json({ success: true, message: "Post Deleted." });
};

export const editPost = async (req: Request, res: Response) => {
  const { title, slug, content } = postSchema.parse(req.body);
  const existingPost = await prismaClient.post.count({
    where: {
      slug,
      id: {
        not: +req.params.id,
      },
    },
  });
  if (existingPost) {
    throw new CustomError("Slug must be unique", 400);
  }
  const image = req.files?.image as any;
  let data: any = { title, slug, content };
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
  const post = await prismaClient.post.update({
    where: { id: Number(req.params.id) },
    data,
  });
  res.json({ success: true, message: "Post Updated", post });
};
