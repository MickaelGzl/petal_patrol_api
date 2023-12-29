import { Router } from "express";
import { ensureIsAuthenticated } from "../../config/authConfig.js";
import { dataUserSend } from "../../controllers/dataController.js";

export const router = Router();

router.get("/", ensureIsAuthenticated, dataUserSend);
