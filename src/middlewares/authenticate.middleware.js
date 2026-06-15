import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { getUserBy } from "../services/user.service.js";

export default async (req, res, next) => {
  const authorization = req.headers.authorization;
  // check headers ของ http request ต้องมี authorization
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw createHttpError[401]("Unauthorized 1");
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    throw createHttpError[401]("Unauthorized 2");
  }
  // verify token
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  // เอา payload.id ไปหา user
  const foundUser = await getUserBy("id", payload.id);
  if (!foundUser) {
    throw createHttpError[401]("Unauthorized 1");
  }
  // สร้าง userData ที่ไม่มี key : password, createdAt, updatedAt
  const { password, createdAt, updatedAt, ...userData } = foundUser;
  // ฝากข้อมูล user ไว้ที่ req (req คือ object ฝากไว้ใน key ชื่อ req.user)
  req.user = userData;
  next();
};
