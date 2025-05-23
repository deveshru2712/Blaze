import {
  SessionFailure,
  SessionSuccess,
  TokenPayload,
  UserSession,
} from "@types";
import { redisClient } from "./redisClient";
import jwt from "jsonwebtoken";
import env from "../validateEnv";
import { CookieOptions } from "express";

export const createAuthSession = async (user: UserSession) => {
  try {
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
