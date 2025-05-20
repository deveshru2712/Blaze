import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../validateEnv";
import { redisClient } from "./redisClient";
import { AuthSession, TokenPayload, UserSession } from "@types";

export const createAuthSession = async ({ user, res }: AuthSession) => {
  try {
    const sessionId = crypto.randomUUID();

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      sessionId,
      username: user.username,
    };

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_KEY, {
      expiresIn: "7d",
    });

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_KEY, {
      expiresIn: "15m",
    });

    // setting the refresh token as a hash in redis

    redisClient.HSET(`user:${payload.userId}:${payload.sessionId}`, {
      refreshToken,
      user: JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
      }),
    });

    // setting an expiry for it

    redisClient.EXPIRE(`user:${payload.userId}:${payload.sessionId}`, 604800);

    res.cookie("authToken", refreshToken, {
      path: "/",
      secure: env.NODE_ENV !== "development",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { success: true, accessToken };
  } catch (error) {
    console.log("Error while setting cookie");
    throw createHttpError(500, "Cannot set the cookie");
  }
};

export const refreshAuthSession = async (req: Request, res: Response) => {
  const token = req.cookies.authToken;

  if (!token) {
    // ask the user to again login
    throw createHttpError(401, "Unauthorized");
  }

  try {
    const decode = jwt.verify(token, env.JWT_REFRESH_KEY) as TokenPayload;

    const redisRefreshToken = await redisClient.HGET(
      `user:${decode.userId}:${decode.sessionId}`,
      "refreshToken"
    );

    if (!redisRefreshToken || redisRefreshToken !== token) {
      // ask the user to login again
      throw createHttpError(401, "Invalid session");
    }

    const newRefreshToken = jwt.sign(decode, env.JWT_REFRESH_KEY, {
      expiresIn: "7d",
    });

    const newAccessToken = jwt.sign(decode, env.JWT_ACCESS_KEY, {
      expiresIn: "15m",
    });

    // updating the redis entry
    await redisClient.HSET(
      `user:${decode.userId}:${decode.sessionId}`,
      "refreshToken",
      newRefreshToken
    );

    // setting expiry
    await redisClient.EXPIRE(
      `user:${decode.userId}:${decode.sessionId}`,
      604800
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
    console.log("Error while refreshing the token :", error);
    throw createHttpError(500, "Failed to refresh session");
  }
};

export const verifyAuthSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw createHttpError(401, "No token provided");
    }

    const accessToken = authHeader.split(" ")[1];
    const decode = jwt.verify(accessToken, env.JWT_ACCESS_KEY) as TokenPayload;

    const userDataString = await redisClient.HGET(
      `user:${decode.userId}:${decode.sessionId}`,
      "user"
    );

    if (!userDataString) {
      throw createHttpError(401, "Invalid session");
    }

    const userData = JSON.parse(userDataString) as UserSession;

    req.user = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(createHttpError(401, "Token expired - please refresh"));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(createHttpError(401, "Invalid token"));
    }
    console.error("Authentication error:", error);
    next(createHttpError(500, "Authentication failed"));
  }
};
