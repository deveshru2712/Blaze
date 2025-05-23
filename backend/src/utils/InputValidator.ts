import { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";

const InputValidator =
  (schema: z.ZodSchema): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.safeParseAsync(req.body);

      if (!result.success) {
        next(result.error);
        return;
      }

      req.body = result.data;

      next();
    } catch (error) {
      next(error);
    }
  };

export default InputValidator;
