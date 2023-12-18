import { Router } from "express";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";
import {
  plantById,
  plantByUser,
  plantCreate,
  plantFindAll,
} from "../../controllers/plantController.js";

export const router = Router();

router.get("/", ensureIsAuthenticated, ensureUserHaveRights, plantFindAll);
router.get("/my-plants", ensureIsAuthenticated, plantByUser);
router.get("/:id", ensureIsAuthenticated, plantById);

router.post("/", ensureIsAuthenticated, plantCreate);

router.put("/:id", (req, res) =>
  res.send("update plant by id. verify userId === req.user.id")
);

router.delete("/id", (req, res) => res.send("delete plant"));
