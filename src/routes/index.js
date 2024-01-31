import { Router } from "express";
import { router as apiRoute } from "./api/apiRoute.js";
import { router as viewRoute } from "./views/viewRoute.js";

export const router = Router();

//use Express.Router
//router.use = each routes corresponding will use the logical of the called router
// * match with any routes

router.use("/api", apiRoute);
router.use("/views", viewRoute);

router.get("/test", (req, res) => {
  res.json({ message: "coucou" });
});

router.use("*", (req, res) => {
  res.status(404).json({ message: "no route corresponding" });
});
