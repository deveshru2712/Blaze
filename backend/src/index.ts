import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors";

import authRouter from "./routes/auth.routes";
import env from "./utils/validateEnv";
import { redisClient } from "./utils/redis/redisClient";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("hii");
});

app.use((req, res, next) => {
  next(createHttpError(404, "Page not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "Unknown error occurred";
  let statusCode = 500;
  let stack: string | undefined;

  if (isHttpError(error)) {
    errorMessage = error.message;
    statusCode = error.status;
    stack = error.stack;
  }

  console.error(error);

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    stack: process.env.NODE_ENV === "development" ? stack : undefined,
  });
});

app.listen(env.PORT, async () => {
  await redisClient.connect();
  console.log("Server is running on the port:", env.PORT);
});
