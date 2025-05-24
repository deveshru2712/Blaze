import express from "express";
import * as authController from "../controllers/auth.controller";
import InputValidator from "../utils/InputValidator";
import { signInInput, signUpInput } from "../utils/schema/authInputTypes";
import { verifyAuthSession } from "../utils/redis/sessionManager";
const router = express.Router();

router.post("/sign-up", InputValidator(signUpInput), authController.signUp);
router.post("/sign-in", InputValidator(signInInput), authController.signIn);
router.post("/logout", authController.logOut);

router.post("/verify", verifyAuthSession, authController.verifySession);
router.post("/refresh", authController.refreshSession);

export default router;
