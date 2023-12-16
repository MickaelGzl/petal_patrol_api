import { Router } from "express";

export const router = Router();

router.get("/signout", (req, res) => res.send("sign out"));

router.post("/signup", (req, res) => res.send("sign up"));
router.post("/signin", (req, res) => res.send("sign in"));

router.post("verify-server-token", (req, res) =>
  res.send("compare token with secret key of server")
);

router.post("is-authenticated", (req, res) =>
  res.send("req.user !== null, cannot acces to login page")
);
