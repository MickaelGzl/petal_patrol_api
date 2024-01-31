import { Router } from "express";
import {
  userCreate,
  userSignIn,
  userSignOut,
} from "../../controllers/userController.js";
// import { ensureIsAuthenticated } from "../../config/authConfig.js";
import {
  createFormToken,
  verifyToken,
} from "../../controllers/authController.js";

export const router = Router();

router.get("/token", createFormToken);
router.get("/signout", userSignOut);
router.get("/is-authenticated", (req, res) =>
  res.json({ alreadyLogged: !!req.user })
);

router.post("/signup", userCreate);
router.post("/signin", userSignIn);

router.post("/verify-server-token", verifyToken, (req, res) =>
  res.json({ message: "ok." })
);

//route for validate account
