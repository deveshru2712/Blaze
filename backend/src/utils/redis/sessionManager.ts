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

// check this out
export const verifyAuthSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.blazeToken;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "no token",
        action: "reauthenticate",
      });
      return;
    }

    const payload = jwt.verify(token, env.JWT_REFRESH_KEY) as TokenPayload;

    const session = await redisClient.HGET(
      `user:${payload.userId}:${payload.sessionId}`,
      "user"
    );

    if (!session) {
      res.status(401).json({
        success: false,
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
        success: false,
        message: "Token expired",
        action: "refresh",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
        action: "reauthenticate",
      });
      return;
    }

    console.error("Auth verification error:", error);
    next(error);
  }
};
