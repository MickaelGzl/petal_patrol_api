import { Router } from "express";
import {
  waitingBotanistFindAll,
  waitingBotanistUpdate,
} from "../../controllers/waitingController.js";

export const router = Router();

router.get("/", waitingBotanistFindAll);

router.put("/:id", waitingBotanistUpdate);
