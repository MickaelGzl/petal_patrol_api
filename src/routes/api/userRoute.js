import { Router } from "express";
import { ensureIsAuthenticated } from "../../config/authConfig.js";
import { userFindAll } from "../../controllers/userController.js";

export const router = Router();

router.get("/", ensureIsAuthenticated, userFindAll);
router.get("/:id", (req, res) => res.send("get user by id"));

router.post("/reset-password", (req, res) =>
  res.send("find user by email and send reset password mail")
);
router.post("/reset-password/:password-token/:server-token", (req, res) =>
  res.send(
    "verify validity of server-token on page enter, and password-token when submit form"
  )
);

router.put("/:id", (req, res) =>
  res.send("update user by id. Need admin or id === req.user.id")
);

router.delete("/:id", (req, res) =>
  res.send(
    "delete user by id. need Admin or id === req.user.id. Also need csrf token"
  )
);
