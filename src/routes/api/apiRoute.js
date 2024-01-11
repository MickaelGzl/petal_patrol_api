import { Router } from "express";
import { router as userRoute } from "./userRoute.js";
import { router as authRoute } from "./authRoute.js";
import { router as plantRoute } from "./plantRoute.js";
import { router as waitingBotanistRoute } from "./waitingBotanistRoute.js";
import { router as dataRoute } from "./dataRoute.js";
import { router as offerRoute } from "./offerRoute.js";
import { router as proposalRoute } from "./proposalRoute.js";
import { router as rapportRoute } from "./rapportRoute.js";
import {
  ensureIsAuthenticated,
  ensureUserHaveRights,
} from "../../config/authConfig.js";

export const router = Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/plant", plantRoute);
router.use("/offer", offerRoute);
router.use("/proposal", proposalRoute);
router.use("/rapport", rapportRoute);
router.use("/data", dataRoute);
router.use(
  "/waiting-list",
  ensureIsAuthenticated,
  ensureUserHaveRights,
  waitingBotanistRoute
);
