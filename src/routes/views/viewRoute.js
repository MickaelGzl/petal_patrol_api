import { Router } from "express";
import {
  userValidateEmail,
  redirectToPasswordForm,
} from "../../controllers/userController.js";

export const router = Router();

router.get(
  "/reset-password/:userId/:userToken/:serverToken",
  redirectToPasswordForm
);

router.get("/email-validation/:token/:serverToken", userValidateEmail);
