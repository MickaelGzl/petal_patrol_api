import { Router } from "express";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";
import {
  rapportById,
  rapportByOfferId,
  rapportCreate,
  rapportGetAll,
  rapportGetMy,
} from "../../controllers/rapportController.js";

export const router = Router();

router.get("/", ensureIsAuthenticated, ensureUserHaveRights, rapportGetAll);
router.get("/my", rapportGetMy);
router.get("/offer/:id", ensureIsAuthenticated, rapportByOfferId);
router.get("/:id", ensureIsAuthenticated, rapportById);

router.post("/:id", ensureIsAuthenticated, rapportCreate);

router.put("/:id", ensureIsAuthenticated, (req, res) => {
  res.send("update rapport with id. Need to be owner");
});

router.delete("/:id", ensureIsAuthenticated, (req, res) =>
  res.send("delete rapport with id. Need to be owner")
);
