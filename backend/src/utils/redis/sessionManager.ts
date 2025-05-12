import { Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../validateEnv";
import { redisClient } from "./redisClient";

interface AuthSessionProps {
  userId: string;
  res: Response;
}

interface TokenPayload {
  userId: string;
  sessionId: string;
}

export const createAuthSession = async ({ userId, res }: AuthSessionProps) => {
  try {
    const sessionId = crypto.randomUUID();

    const token = jwt.sign({ userId, sessionId } as TokenPayload, env.JWT_KEY, {
      expiresIn: "1d",
    });

    await redisClient.SETEX(`user:${userId}:${sessionId}`, 86400, token);

    res.cookie("key", token, {
      path: "/",
      httpOnly: true,
      secure: env.NODE_ENV !== "development",
      maxAge: 86400 * 1000,
      sameSite: "strict",
    });

    return { success: true, sessionId };
  } catch (error) {
    console.error("Session creation error:", error);
    throw createHttpError(500, "Failed to create session");
  }
};
