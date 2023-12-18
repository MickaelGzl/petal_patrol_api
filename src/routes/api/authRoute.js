import { Router } from "express";
import {
  userCreate,
  userSignIn,
  userSignOut,
} from "../../controllers/userController.js";
import { ensureIsAuthenticated } from "../../config/authConfig.js";
import {
  createFormToken,
  verifyToken,
} from "../../controllers/authController.js";

export const router = Router();

router.get("/token", ensureIsAuthenticated, createFormToken);
router.get("/signout", userSignOut);

router.post("/signup", userCreate);
router.post("/signin", userSignIn);

router.post("verify-server-token", verifyToken, (req, res) =>
  res.json({ message: "ok." })
);

router.post("is-authenticated", ensureIsAuthenticated, (req, res) =>
  res.json({ message: "already logged in." })
);

//route for validate account
