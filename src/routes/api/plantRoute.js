import { Router } from "express";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";
import {
  plantById,
  plantByUser,
  plantCreate,
  plantDelete,
  plantFindAll,
  plantUpdate,
} from "../../controllers/plantController.js";

export const router = Router();

router.get("/", ensureIsAuthenticated, ensureUserHaveRights, plantFindAll);
router.get("/my-plants", ensureIsAuthenticated, plantByUser);
router.get("/:id", ensureIsAuthenticated, plantById);

router.post("/", ensureIsAuthenticated, plantCreate);

router.put("/:id", ensureIsAuthenticated, plantUpdate);

router.delete("/:id", ensureIsAuthenticated, plantDelete);
