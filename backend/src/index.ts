import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import createHttpError, { isHttpError } from "http-errors";
import cors from "cors";

import env from "./utils/validateEnv";
import authRouter from "./routes/auth.routes";
import { redisClient } from "./utils/redis/redisClient";
import { ZodError } from "zod";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("hii");
});

// Handle 404 - Page not found
app.use((req, res, next) => {
  next(createHttpError(404, "Page not found"));
});

// Error handling middleware
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let errorMessage = "Unknown error occurred";
  let errorStack: string | undefined;

  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      field: issue.path.join(".") || "request",
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  if (error instanceof Error) {
    if ("status" in error && typeof error.status === "number") {
      statusCode = error.status;
    }
    errorMessage = error.message;
    errorStack = error.stack;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  console.error(error);

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
  });
});

export const server = app.listen(env.PORT, async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
    console.log("Server is running on the port:", env.PORT);
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
});
