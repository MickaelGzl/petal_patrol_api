import { Router } from "express";
import { router as apiRoute } from "./api/apiRoute.js";

export const router = Router();

//use Express.Router
//router.use = each routes corresponding will use the logical of the called router
// * match with any routes

router.use("/api", apiRoute);
router.use("*", (req, res) => {
  res.send("no route corresponding");
});
