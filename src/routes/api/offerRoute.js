import { Router } from "express";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";
import {
  offerCreate,
  offerDelete,
  offerGetAll,
  offerGetMy,
  offerGetOne,
  offerUpdate,
  offerUpdateAdvice,
} from "../../controllers/offerController.js";

export const router = Router();

router.get("/all", ensureIsAuthenticated, ensureUserHaveRights, offerGetAll);
router.get("/", ensureIsAuthenticated, offerGetAll);
router.get("/my", ensureIsAuthenticated, offerGetMy);
router.get("/:id", ensureIsAuthenticated, offerGetOne);

router.post("/", ensureIsAuthenticated, offerCreate);

router.put("/:id", ensureIsAuthenticated, offerUpdate);
router.put("/:id/advice", ensureIsAuthenticated, offerUpdateAdvice);

router.delete("/:id", ensureIsAuthenticated, offerDelete);
