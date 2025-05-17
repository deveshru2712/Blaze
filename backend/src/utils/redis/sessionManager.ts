import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../validateEnv";
import { redisClient } from "./redisClient";

import { AuthSession, TokenPayload } from "@types";

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
      604800,
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

export const verifyAuthSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookie = req.headers.authorization;
    if (!cookie) {
      throw createHttpError(401, "No token provided");
    }

    const accessToken = cookie.split(" ")[1];

    const decode = jwt.verify(accessToken, env.JWT_ACCESS_KEY, (error) => {
      if (error) {
        if (error.name == "JsonWebTokenError") {
          return res.status(401).json("Invalid token.Please login again.");
        }
        if (error.name == "TokenExpiredError") {
          return res.status(401).json("Token expired. Refresh required");
        }
      }
    });

    // req.userId = payload.userId;
    next();
  } catch (error) {
    throw createHttpError(500, "Unable to verify the request");
  }
};
