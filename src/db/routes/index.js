import { Router } from "express";
import { router as apiRoute } from "./api/apiRoute.js";

export const router = Router();

router.use("/api", apiRoute);
router.use("*", (req, res) => {
  res.send("no route corresponding");
});
