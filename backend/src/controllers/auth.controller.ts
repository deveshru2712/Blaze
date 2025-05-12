import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { createAuthSession } from "../utils/redis/sessionManager";
import prismaClient from "../utils/prismaClient";
import { SignUpType } from "../utils/schema/authInputTypes";
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

    const { success, sessionId } = await createAuthSession({
      userId: newUser.id,
      res,
    });

    if (!success) {
      throw createHttpError(500, "Unable to create session");
    }

    res.status(201).json({
      success: true,
      user: { ...newUser, password: undefined },
      sessionId,
    });
  } catch (error) {
    next(error);
  }
};
export const signIn: RequestHandler = (req, res, next) => {
  try {
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
