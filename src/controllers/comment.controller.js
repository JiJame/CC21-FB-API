import createHttpError from "http-errors";
import prisma from "../config/prisma.config.js";

export async function createComment(req, res, next) {
  const { id: postId } = req.params;
  const { message } = req.body;
  const userId = req.user.id;

  const postData = await prisma.post.findUnique({ where: { id: +postId } });
  if (!postData) {
    return next(createHttpError[404]("Not found this post"));
  }
  const result = await prisma.comment.create({
    data: { message, postId: +postId, userId },
  });
  res.status(201).json({
    message: "Create comment done",
    result,
  });
}

export async function deleteComment(req, res, next) {
  const { id } = req.params;
  const comment = await prisma.comment.findUnique({ where: { id: +id } });
  if (comment.userId !== req.user.id) {
    return next(createHttpError[401]("Cannot delete this comment"));
  }

  const result = await prisma.comment.delete({
    where: { id: +id },
  });
  res.json({
    message: "Delete Comment...",
    result,
  });
}
