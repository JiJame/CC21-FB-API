import createHttpError from "http-errors";
import prisma from "../config/prisma.config.js";

export const getAllPosts = async (req, res) => {
  const result = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, profileImage: true } },
      comments: {
        include: {
          user: {
            select: { firstName: true, lastName: true, profileImage: true },
          },
        },
      },
      likes: {
        include: { user: { select: { firstName: true, lastName: true } } },
      },
    },
  });
  res.json({ posts: result });
};

export const createPost = async (req, res) => {
  const { message, image } = req.body;

  const data = { message, image, userId: req.user.id };

  const result = await prisma.post.create({ data });
  console.log(result);

  res.status(201).json({
    message: "Create new Post done",
    post: result,
  });
};

export const deletePost = async (req, res, next) => {
  const { id } = req.params;

  const foundPost = await prisma.post.findUnique({
    where: { id: +id },
  });
  if (!foundPost) {
    return next(createHttpError[404]("Data not found"));
  }
  if (req.user.id != foundPost.userId) {
    return next(createHttpError[401]("Cannot delete this post"));
  }

  const result = await prisma.post.delete({ where: { id: +id } });
  res.json({
    message: "Delete done",
  });
};

export const updatePost = async (req, res, next) => {
  const { id } = req.params;
  const { message, image } = req.body;

  const foundPost = await prisma.post.findUnique({
    where: { id: +id },
  });
  if (!foundPost || req.user.id !== foundPost.userId) {
    return next(createHttpError[400]("Cannot edit this post"));
  }

  const result = await prisma.post.update({
    where: { id: +id },
    data: { message, image },
  });
  res.json({
    message: "Update post done",
    post: result,
  });
};
