import { z } from "zod";

export const signUpInput = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signInInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignInType = z.infer<typeof signInInput>;
export type SignUpType = z.infer<typeof signUpInput>;
