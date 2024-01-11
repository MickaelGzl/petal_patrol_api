import { Router } from "express";
import { ensureIsAuthenticated } from "../../config/authConfig.js";
import {
  proposalByOffer,
  proposalByUser,
  proposalCreate,
  proposalDelete,
  proposalGetOne,
  proposalResponse,
  proposalUpdate,
} from "../../controllers/proposalController.js";

export const router = Router();

router.get("/my", ensureIsAuthenticated, proposalByUser);
router.get("/offer/:id", ensureIsAuthenticated, proposalByOffer);
router.get("/:id", ensureIsAuthenticated, proposalGetOne);

router.post("/:id", ensureIsAuthenticated, proposalCreate);

router.put("/:id", ensureIsAuthenticated, proposalUpdate);
router.put("/:id/response", ensureIsAuthenticated, proposalResponse);

router.delete("/:id", ensureIsAuthenticated, proposalDelete);
