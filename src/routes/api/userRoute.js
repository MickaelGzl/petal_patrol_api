import { Router } from "express";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";
import {
  userDelete,
  userFindAll,
  userFindOne,
  userPasswordForgot,
  userUpdate,
} from "../../controllers/userController.js";

export const router = Router();

router.get("/", ensureIsAuthenticated, userFindAll);
router.get("/:id", ensureIsAuthenticated, userFindOne);

router.post("/reset-password", userPasswordForgot);
router.post("/reset-password/:password-token/:server-token", (req, res) =>
  res.send(
    "verify validity of server-token on page enter, and password-token when submit form"
  )
);

router.put("/:id", ensureIsAuthenticated, ensureUserHaveRights, userUpdate);

router.delete("/:id", ensureIsAuthenticated, ensureUserHaveRights, userDelete);
