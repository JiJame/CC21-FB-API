import express from "express";
import authRoute from "./routes/auth.route.js";
import createHttpError from "http-errors";
import errorMiddleware from "./middlewares/error.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import shutdownUtil from "./utils/shutdown.util.js";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/post", (req, res) => {
  res.send("post service");
});
app.use("/api/comment", (req, res) => {
  res.send("comment service");
});
app.use("/api/like", (req, res) => {
  res.send("like service");
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

process.on("SIGINT", () => shutdownUtil("SIGINT")); // CTRL + C
process.on("SIGTERM", () => shutdownUtil("SIGTERM")); // normal kill process

// Catch unhandled errors
process.on("uncaughtException", () => shutdownUtil("uncaughtException"));
process.on("unhandleRejection", () => shutdownUtil("unhandleRejection"));

export default app;
