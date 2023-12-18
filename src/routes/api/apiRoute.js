import { Router } from "express";
import { router as userRoute } from "./userRoute.js";
import { router as authRoute } from "./authRoute.js";
import { router as plantRoute } from "./plantRoute.js";

export const router = Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/plant", plantRoute);
