import { Response } from "express";

export interface AuthSession {
  userId: string;
  res: Response;
}

export interface TokenPayload {
  userId: string;
  sessionId: string;
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
    }
  }
}
