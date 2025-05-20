import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { createAuthSession } from "../utils/redis/sessionManager";
import prismaClient from "../utils/prismaClient";
import { SignInType, SignUpType } from "../utils/schema/authInputTypes";
import bcrypt from "bcryptjs";

export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpType,
  unknown
> = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      throw createHttpError(400, "Please provide all fields");
    }

    if (password.length < 6) {
      throw createHttpError(400, "Password must be at least 6 characters");
    }

    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createHttpError(409, "Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prismaClient.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const { success, accessToken } = await createAuthSession({
      userId: newUser.id,
      res,
    });

    if (!success) {
      throw createHttpError(500, "Unable to process your request");
    }

    res.status(201).json({
      success: true,
      user: { ...newUser, password: undefined },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const signIn: RequestHandler<
  unknown,
  unknown,
  SignInType,
  unknown
> = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw createHttpError(400, "Please provide all fields");
    }

    if (password.length < 6) {
      throw createHttpError(400, "Password must be at least 6 characters");
    }

    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        username: true,
      },
    });

    if (!user) {
      throw createHttpError(404, "Unable to process your request");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw createHttpError(401, "Unauthorized");
    }

    const { accessToken, success } = await createAuthSession({
      userId: user.id,
      res,
    });

    if (!success) {
      throw createHttpError(500, "Unable to process ");
    }

    res.status(200).json({
      success: true,
      user: {
        ...user,
        password: undefined,
      },
      accessToken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const logOut: RequestHandler = (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const refreshAccessToken: RequestHandler = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      // accessToken,
    });
  } catch (error) {
    next(error);
  }
};
