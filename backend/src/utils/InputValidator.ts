import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { z } from "zod";

const InputValidator =
  (schema: z.ZodSchema): RequestHandler =>
  async (req, res, next) => {
    try {
      const result = await schema.safeParseAsync(req.body);

      if (!result.success) {
        const validationErrors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        throw createHttpError(400, "Validation error", {
          errors: validationErrors,
        });
      }

      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };

export default InputValidator;
