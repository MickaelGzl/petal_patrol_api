import { Router } from "express";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";
import {
  rapportById,
  rapportByOfferId,
  rapportCreate,
  // rapportDelete,
  rapportGetAll,
  rapportGetMy,
  rapportUpdate,
  rapportUpdateImage,
} from "../../controllers/rapportController.js";

export const router = Router();

router.get("/", ensureIsAuthenticated, ensureUserHaveRights, rapportGetAll);
router.get("/my", rapportGetMy);
router.get("/offer/:id", ensureIsAuthenticated, rapportByOfferId);
router.get("/:id", ensureIsAuthenticated, rapportById);

router.post("/:id", ensureIsAuthenticated, rapportCreate);

router.put("/:id", ensureIsAuthenticated, rapportUpdate);
router.put("/:id/image", ensureIsAuthenticated, rapportUpdateImage);

// router.delete("/:id", ensureIsAuthenticated, rapportDelete);
