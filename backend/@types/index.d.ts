import { Response } from "express";

export interface AuthSession {
  user: User;
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
        username: string;
        email: string;
      };
    }
  }
}

interface UserSession {
  id: string;
  username: string;
  email: string;
}

interface SessionSuccess {
  success: true;
  refreshToken: string;
  accessToken: string;
  cookieConfig: CookieOptions;
}

interface SessionFailure {
  success: false;
  error: string;
  errorCode?: string;
}
