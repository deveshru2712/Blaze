import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../validateEnv";
import { redisClient } from "./redisClient";
import { Request, Response } from "express";

export const createAuthSession = async ({ userId, res }: AuthSession) => {
  try {
    const sessionId = crypto.randomUUID();

    const refreshToken = jwt.sign(
      { userId, sessionId } as TokenPayload,
      env.JWT_REFRESH_KEY,
      {
        expiresIn: "7d",
      }
    );

    const accessToken = jwt.sign(
      { userId, sessionId } as TokenPayload,
      env.JWT_ACCESS_KEY,
      {
        expiresIn: "15m",
      }
    );

    await redisClient.SETEX(
      `user:${userId}:${sessionId}`,
      604800000,
      refreshToken
    );

    res.cookie("authToken", refreshToken, {
      path: "/",
      secure: env.NODE_ENV !== "development",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { success: true, accessToken };
  } catch (error) {
    throw createHttpError(500, "Cannot set the cookie");
  }
};

export const refreshAuthSession = async (req: Request, res: Response) => {
  const cookie = req.cookies.authToken;

  if (!cookie) {
    throw createHttpError(401, "Unauthorized");
  }
  try {
    const decode = jwt.verify(cookie, env.JWT_REFRESH_KEY) as TokenPayload;

    const newRefreshToken = jwt.sign(decode, env.JWT_REFRESH_KEY, {
      expiresIn: "7d",
    });

    const newAccessToken = jwt.sign(decode, env.JWT_ACCESS_KEY, {
      expiresIn: "15m",
    });

    await redisClient.SETEX(
      `session:user:${decode.userId}:${decode.sessionId}`,
      604800,
      newRefreshToken
    );

    res.cookie("authToken", newRefreshToken, {
      path: "/",
      secure: env.NODE_ENV !== "development",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { success: true, newAccessToken };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createHttpError(401, "Session expired - please log in again");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw createHttpError(401, "Invalid authentication token");
    }
    throw createHttpError(500, "Failed to refresh session");
  }
};
