import { Router } from "express";
import { router as apiRoute } from "./api/apiRoute.js";

export const router = Router();

//use Express.Router
//router.use = each routes corresponding will use the logical of the called router
// * match with any routes

router.use("/api", apiRoute);

//to have a view on template emails
// router.get("/test", (req, res) => {
//   res.render("resetPasswordTemplate", { email: "toto", url: "tata" });
// });

router.use("*", (req, res) => {
  res.status(404).json({ message: "no route corresponding" });
});
