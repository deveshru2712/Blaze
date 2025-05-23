import express from "express";
import * as authController from "../controllers/auth.controller";
import InputValidator from "../utils/InputValidator";
import { signInInput, signUpInput } from "../utils/schema/authInputTypes";
const router = express.Router();

router.post("/sign-up", InputValidator(signUpInput), authController.signUp);
router.post("/sign-in", InputValidator(signInInput), authController.signIn);
router.post("/logout", authController.logOut);

export default router;
