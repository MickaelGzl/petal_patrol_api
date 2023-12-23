import { Router } from "express";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";
import {
  userDelete,
  userDeleteAvatar,
  userFindAll,
  userFindOne,
  userPasswordForgot,
  userResetPassword,
  userUpdateEmail,
  userUpdateAvatar,
  userUpdateName,
  userValidateEmail,
} from "../../controllers/userController.js";

export const router = Router();

router.get("/", ensureIsAuthenticated, ensureUserHaveRights, userFindAll);
router.get("/validate/:token/:serverToken", userValidateEmail);
router.get("/:id", ensureIsAuthenticated, userFindOne);

router.post("/reset-password", userPasswordForgot);
router.post("/reset-password/:id/:passwordToken", userResetPassword);

router.put("/avatar", ensureIsAuthenticated, userUpdateAvatar);
router.put("/email", ensureIsAuthenticated, userUpdateEmail);
router.put("/:id", ensureIsAuthenticated, ensureUserHaveRights, userUpdateName);

router.delete("/", ensureIsAuthenticated, userDelete);

router.delete(
  "/:id/avatar",
  ensureIsAuthenticated,
  ensureUserHaveRights,
  userDeleteAvatar
);
