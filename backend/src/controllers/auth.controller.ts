import bcrypt from "bcryptjs";
import { NextFunction, Request, RequestHandler, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { SignInType, SignUpType } from "../utils/schema/authInputTypes";
import {
  createAuthSession,
  refreshAuthSession,
} from "../utils/redis/sessionManager";

export const signUp = async (
  req: Request<unknown, unknown, SignUpType, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      res.status(400).json({
        message: "Please provide all fields",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        message: "Password must be of 6 character",
      });
      return;
    }

    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        message: "Email already in use",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prismaClient.user.create({
      data: { username, email, password: hashedPassword },
    });

    // create an auth session

    const session = await createAuthSession(newUser);

    if (!session.success) {
      console.error("Session creation failed:", session.error);
      res.status(500).json({
        message: "Failed to create authentication session",
        action: "reauthenticate",
      });
      return;
    }

    res.cookie("blazeToken", session.refreshToken, session.cookieConfig);

    res.status(200).json({
      success: true,
      user: { ...newUser, password: undefined },
      accessToken: session.accessToken,
      message: "Account created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signIn: RequestHandler = async (
  req: Request<unknown, unknown, SignInType, unknown>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide all fields",
      });
      return;
    }

    if (password.length > 6) {
      res.status(400).json({
        message: "Password must of 6 character",
      });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      res.status(400).json({
        message: "Invalid credentials",
      });
      return;
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    const session = await createAuthSession(user);

    if (!session.success) {
      console.error("Session creation failed:", session.error);
      res.status(500).json({
        message: "Failed to create authentication session",
        action: "reauthenticate",
      });
      return;
    }

    res.cookie("blazeToken", session.refreshToken, session.cookieConfig);

    res.status(200).json({
      success: true,
      user: { ...user, password: undefined },
      accessToken: session.accessToken,
      message: "Logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const logOut: RequestHandler = async (req, res, next) => {
  try {
    res.cookie("blazeToken", "", {
      expires: new Date(0),
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Logout successfully",
    });
    return;
  } catch (error) {
    console.log("An error occurred while log out:", error);
    next(error);
  }
};

export const refreshSession: RequestHandler = async (req, res, next) => {
  try {
    const session = await refreshAuthSession(req);

    if (!session.success) {
      console.error("Session creation failed:", session.error);
      res.status(500).json({
        message: "Failed to refresh session",
        action: "reauthenticate",
      });
      return;
    }

    res.cookie("blazeToken", session.refreshToken, session.cookieConfig);

    res.status(200).json({
      success: true,
      accessToken: session.accessToken,
      message: "Session refresh",
    });
  } catch (error) {
    next(error);
  }
};

export const verifySession: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      message: "User verified",
      user,
    });
  } catch (error) {
    next(error);
  }
};
