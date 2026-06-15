import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import authenticateMiddleware from "../middlewares/authenticate.middleware.js";

const authRoute = Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.get("/me", authenticateMiddleware, getMe);

export default authRoute;
