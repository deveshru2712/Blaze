import {
  SessionFailure,
  SessionSuccess,
  TokenPayload,
  UserSession,
} from "@types";
import { redisClient } from "./redisClient";
import jwt from "jsonwebtoken";
import env from "../validateEnv";
import { CookieOptions, NextFunction, Request, Response } from "express";

export const createAuthSession = async (user: UserSession) => {
  try {
    // this will delete the existing session
    const existingSessions = await redisClient.keys(`user:${user.id}:*`);
    if (existingSessions.length > 0) {
      await redisClient.del(existingSessions);
    }

    const sessionId = crypto.randomUUID();

    const payload: TokenPayload = { sessionId, userId: user.id };

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_KEY, {
      expiresIn: "15d",
    });

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_KEY, {
      expiresIn: "15m",
    });

    // creating a redis entry
    await redisClient.HSET(`user:${user.id}:${sessionId}`, {
      refreshToken,
      user: JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
      }),
    });

    // setting the expiry for the redis cache
    await redisClient.EXPIRE(`user:${user.id}:${sessionId}`, 604800);

    const cookieConfig: CookieOptions = {
      path: "/",
      secure: env.NODE_ENV !== "development",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return {
      success: true,
      refreshToken,
      accessToken,
      cookieConfig,
    } as SessionSuccess;
  } catch (error) {
    console.log("An error occurred while creating an auth session:", error);
    return {
      success: false,
      error,
    } as SessionFailure;
  }
};

export const verifyAuthSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Invalid token",
        action: "refresh",
      });
      return;
    }

    const authHeader = token.split(" ")[1];

    const payload = jwt.verify(authHeader, env.JWT_ACCESS_KEY) as TokenPayload;

    const session = await redisClient.HGET(
      `user:${payload.userId}:${payload.sessionId}`,
      "user"
    );

    if (!session) {
      res.status(401).json({
        message: "session expired",
        action: "reauthenticate",
      });
      return;
    }

    const sessionData = JSON.parse(session) as UserSession;

    req.user = {
      id: sessionData.id,
      email: sessionData.email,
      username: sessionData.username,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Token expired",
        action: "refresh",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: "Invalid token",
        action: "reauthenticate",
      });
      return;
    }

    console.error("Auth verification error:", error);
    next(error);
  }
};
