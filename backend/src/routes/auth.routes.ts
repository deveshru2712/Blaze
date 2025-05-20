import express from "express";
import validate from "../utils/InputValidator";
import * as authController from "../controllers/auth.controller";
import { signInInput, signUpInput } from "../utils/schema/authInputTypes";
import { verifyAuthSession } from "src/utils/redis/sessionManager";

const router = express.Router();

router.post("/sign-up", validate(signUpInput), authController.signUp);
router.post("/sign-in", validate(signInInput), authController.signIn);
router.post("/logout", authController.logOut);

router.get("/verify", verifyAuthSession);
// router.post("/refresh", authController.refreshToken);

export default router;
