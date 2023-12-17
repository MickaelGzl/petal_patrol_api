import { Router } from "express";
import {
  userCreate,
  userSignIn,
  userSignOut,
} from "../../controllers/userController.js";
import { ensureIsAuthenticated } from "../../config/authConfig.js";
import { createFormToken } from "../../controllers/authController.js";

export const router = Router();

router.get("/token", ensureIsAuthenticated, createFormToken);
router.get("/signout", userSignOut);

router.post("/signup", userCreate);
router.post("/signin", userSignIn);

router.post("verify-server-token", (req, res) =>
  res.send("compare token with secret key of server")
);

router.post("is-authenticated", (req, res) =>
  res.send("req.user !== null, cannot acces to login page")
);
