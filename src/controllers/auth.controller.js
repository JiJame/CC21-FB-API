import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import identityKeyUtil from "../utils/identity-key.util.js";
import prisma from "../config/prisma.config.js";
import { registerSchema, loginSchema } from "../validations/schema.js";
import { createUser, getUserBy } from "../services/user.service.js";

export const register = async (req, res, next) => {
  const { identity, firstName, lastName, password, confirmPassword } = req.body;
  // validation
  // if (
  //   !identity.trim() ||
  //   !firstName.trim() ||
  //   !lastName.trim() ||
  //   !password.trim() ||
  //   !confirmPassword.trim()
  // ) {
  //   return next(createHttpError[400]("fill all inputs"));
  // }
  const user = registerSchema.parse(req.body);
  // const identityKey = user.email ? "email" : "mobile";  ของใหม่
  const identityKey = identityKeyUtil(identity);

  // if (confirmPassword !== password) {
  //   return next(createHttpError[400](`Check Confirm-password`));
  // }

  // // Check Identity
  // const identityKey = identityKeyUtil(identity);

  // if (!identityKey) {
  //   return next(createHttpError[400](""));
  // }

  // find user if already have registered
  const haveUser = await prisma.user.findUnique({
    where: { [identityKey]: identity },
  });
  if (haveUser) {
    return next(createHttpError[409]("This user already register"));
  }

  const newUser = {
    [identityKey]: identity,
    password: await bcrypt.hash(password, 10),
    firstName: firstName,
    lastName: lastName,
  };

  const result = await prisma.user.create({ data: newUser });

  // ! {
  // // version ใหม่
  // const haveUser = await getUserBy(identityKey, identity);
  // if (haveUser) {
  //   return next(createHttpError[409]("This user already register"));
  // }
  // const result = await createUser(user);
  // !}
  res.json({
    msg: "Register Successful",
    result: result,
  });
};

export const login = async (req, res, next) => {
  // if (req.body.password === "a1234") {
  //   return next(createHttpError[400]("bad password"));
  // }
  const { identity, password } = req.body;
  const user = loginSchema.parse(req.body);
  const identityKey = identityKeyUtil(identity);

  if (!identityKey) {
    return next(createHttpError[400]("identity must be email or phone number"));
  }

  const foundUser = await prisma.user.findUnique({
    where: { [identityKey]: identity },
  });

  // ถ้าไม่มี user
  if (!foundUser) {
    return next(createHttpError[401]("Invalid Login"));
  }

  // Check password
  let pwOk = await bcrypt.compare(password, foundUser.password);
  if (!pwOk) {
    return next(createHttpError[401]("Invalid Login"));
  }

  const payload = { id: foundUser.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "15d",
  });
  // console.log(token);
  const { password: pw, createdAt, updatedAt, ...userData } = foundUser;

  res.json({
    msg: "Login Successful",
    token: token,
    user: userData,
  });
};

export const getMe = (req, res) => {
  res.json({ user: req.user });
};
