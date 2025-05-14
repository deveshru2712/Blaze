import { Response } from "express";

declare  global {
  interface AuthSession {
    userId: string;
    res: Response;
  }

  interface TokenPayload {
    userId: string;
    sessionId: string;
  }
}